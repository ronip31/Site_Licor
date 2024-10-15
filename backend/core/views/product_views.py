from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Produto, ImagemProduto, Marca
from ..serializers import ProductSerializer, ImagemProdutoSerializer, MarcaSerializer, ProdutoSerializer, ProductCupomSerializer, ProdutoSerializerSemDescricao
#from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import os
from ..permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework import generics

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'uuid'  # Adicione esta linha para utilizar o campo UUID
    #permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        produto_serializer = ProductSerializer(instance, data=request.data, partial=partial)

        if produto_serializer.is_valid():
            produto = produto_serializer.save()
            return Response(produto_serializer.data, status=status.HTTP_200_OK)

        print("Erros na edição do produto:", produto_serializer.errors)
        return Response(produto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class Products_cupom_ViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProductCupomSerializer
    lookup_field = 'uuid'  # Adicione esta linha para utilizar o campo UUID
    #permission_classes = [IsAdminUser]



# class ProductClientView(generics.ListAPIView):
#     queryset = Produto.objects.filter(status=Produto.ATIVO)
#     serializer_class = ProductClientSerializer
#     permission_classes = [AllowAny]  # Permite acesso público


class ProdutosComImagensListView(generics.RetrieveAPIView):
    queryset = Produto.objects.all().prefetch_related('imagens')
    serializer_class = ProdutoSerializer
    permission_classes = [AllowAny]  # Permite acesso público
    lookup_field = 'slug'

class ProdutosImagensSemDescricaoListView(generics.ListAPIView):
    queryset = Produto.objects.all().prefetch_related('imagens')
    serializer_class = ProdutoSerializerSemDescricao
    permission_classes = [AllowAny]  # Permite acesso público