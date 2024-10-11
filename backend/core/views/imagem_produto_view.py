from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import os
from ..models import Produto, ImagemProduto
from ..serializers import ImagemProdutoSerializer, ImagemProdutoSerializerView
from ..permissions import IsAdminUser
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from ..services import compress_image
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
import sys
from PIL import Image

# Definir tamanho máximo e tipos permitidos
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # Permitir até 10MB antes de compressão
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

class ImagemProdutoViewSet(viewsets.ModelViewSet):
    queryset = ImagemProduto.objects.all()
    serializer_class = ImagemProdutoSerializer
    lookup_field = 'uuid'
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        imagem_path = instance.imagem.path
        response = super().destroy(request, *args, **kwargs)
        if os.path.exists(imagem_path):
            os.remove(imagem_path)
        return response

    @action(detail=False, methods=['get', 'post'], url_path='por_produto/(?P<produto_pk>[^/.]+)')
    def por_produto(self, request, produto_pk=None):
        if request.method == 'GET':
            try:
                produto = Produto.objects.get(uuid=produto_pk)
            except Produto.DoesNotExist:
                return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

            imagens = ImagemProduto.objects.filter(produto=produto)
            serializer = self.get_serializer(imagens, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            try:
                produto = Produto.objects.get(uuid=produto_pk)
            except Produto.DoesNotExist:
                return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

            if 'imagens' in request.FILES:
                for image in request.FILES.getlist('imagens'):
                    if image.size > MAX_IMAGE_SIZE:
                        return Response({"detail": f"Arquivo {image.name} é muito grande. O tamanho máximo permitido é {MAX_IMAGE_SIZE / (1024 * 1024)}MB."}, status=status.HTTP_400_BAD_REQUEST)
                    if image.content_type not in ALLOWED_IMAGE_TYPES:
                        return Response({"detail": f"Tipo de arquivo não permitido: {image.content_type}"}, status=status.HTTP_400_BAD_REQUEST)

                    compressed_image = compress_image(image)
                    ImagemProduto.objects.create(produto=produto, imagem=compressed_image)
                return Response({"detail": "Imagens adicionadas com sucesso."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Nenhuma imagem recebida."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Método não permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['post'], url_path='rotacionar')
    def rotacionar_imagem(self, request, uuid=None):
        """Ação para rotacionar a imagem."""
        try:
            imagem_produto = self.get_object()
        except ImagemProduto.DoesNotExist:
            return Response({"detail": "Imagem não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        rotation_degrees = request.data.get('rotation', 0)

        # Abrir a imagem
        img = Image.open(imagem_produto.imagem.path)

        # Rotacionar a imagem
        rotated_img = img.rotate(-int(rotation_degrees), expand=True)

        # Salvar a imagem rotacionada diretamente no caminho original
        rotated_img.save(imagem_produto.imagem.path)

        return Response({"detail": "Imagem rotacionada com sucesso."}, status=status.HTTP_200_OK)



    
class ImagensPorProdutoView(generics.ListAPIView):
    serializer_class = ImagemProdutoSerializerView

    def get_queryset(self):
        produto_uuid = self.kwargs.get('produto_uuid')
        produto = get_object_or_404(Produto, uuid=produto_uuid)
        return ImagemProduto.objects.filter(produto=produto)