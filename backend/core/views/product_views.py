from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Produto, ImagemProduto, Marca
from ..serializers import ProductSerializer, ImagemProdutoSerializer, MarcaSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import os


class ProdutoViewSet(viewsets.ModelViewSet):
    
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    #parser_classes = (MultiPartParser, FormParser)
    #permission_classes = [IsAdminUser]
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        produto_serializer = ProductSerializer(instance, data=request.data, partial=partial)

        if produto_serializer.is_valid():
            produto = produto_serializer.save()

            # Salvar imagens se forem enviadas durante a edição
            if 'imagens' in request.FILES:
                for image in request.FILES.getlist('imagens'):
                    print("Salvando imagem durante a edição:", image)
                    # Verifique se o campo `imagem` está correto e corresponde ao nome definido no modelo
                    ImagemProduto.objects.create(produto=produto, imagem=image)
                    print(f"Imagem {image.name} salva com sucesso durante a edição.")
            else:
                print("Nenhuma imagem recebida durante a edição.")

            return Response(produto_serializer.data, status=status.HTTP_200_OK)

        print("Erros na edição do produto:", produto_serializer.errors)
        return Response(produto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImagemProdutoViewSet(viewsets.ModelViewSet):
    queryset = ImagemProduto.objects.all()
    serializer_class = ImagemProdutoSerializer
    parser_classes = (MultiPartParser, FormParser)
    #permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Salva o caminho do arquivo de imagem antes de deletar a instância
        imagem_path = instance.imagem.path

        # Remove a instância do banco de dados
        response = super().destroy(request, *args, **kwargs)

        # Remove o arquivo de imagem fisicamente do disco
        if os.path.exists(imagem_path):
            os.remove(imagem_path)
        
        return response

    @action(detail=False, methods=['get', 'post'], url_path='por_produto/(?P<produto_pk>[^/.]+)')
    def por_produto(self, request, produto_pk=None):
        if request.method == 'GET':
            # Obter imagens do produto
            if produto_pk is not None:
                imagens = ImagemProduto.objects.filter(produto__id=produto_pk)
                serializer = self.get_serializer(imagens, many=True)
                return Response(serializer.data)
            return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        elif request.method == 'POST':
            # Adicionar novas imagens ao produto
            if produto_pk is not None:
                produto = Produto.objects.filter(id=produto_pk).first()
                if not produto:
                    return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

                # Salvar imagens enviadas
                if 'imagens' in request.FILES:
                    for image in request.FILES.getlist('imagens'):
                        ImagemProduto.objects.create(produto=produto, imagem=image)
                    return Response({"detail": "Imagens adicionadas com sucesso."}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "Nenhuma imagem recebida."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Método não permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
