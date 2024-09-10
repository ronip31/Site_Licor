from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import os
from ..models import Produto, ImagemProduto
from ..serializers import ImagemProdutoSerializer
from ..permissions import IsAdminUser

# Definir tamanho máximo e tipos permitidos
MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

class ImagemProdutoViewSet(viewsets.ModelViewSet):
    queryset = ImagemProduto.objects.all()
    serializer_class = ImagemProdutoSerializer
    lookup_field = 'uuid'
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAdminUser]

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
                    # Validação de tipo e tamanho de arquivo
                    if image.size > MAX_IMAGE_SIZE:
                        return Response({"detail": f"Arquivo {image.name} é muito grande. O tamanho máximo permitido é 2MB."}, status=status.HTTP_400_BAD_REQUEST)
                    if image.content_type not in ALLOWED_IMAGE_TYPES:
                        return Response({"detail": f"Tipo de arquivo não permitido: {image.content_type}"}, status=status.HTTP_400_BAD_REQUEST)
                    
                    ImagemProduto.objects.create(produto=produto, imagem=image)
                return Response({"detail": "Imagens adicionadas com sucesso."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Nenhuma imagem recebida."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Método não permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
