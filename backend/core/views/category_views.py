from rest_framework import generics
from ..models import Categoria
from ..serializers import CategoriaSerializer
from rest_framework.permissions import IsAdminUser

class ListCategoriasView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    #permission_classes = [IsAdminUser]

class CategoriasCreateView(generics.CreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    #permission_classes = [IsAdminUser]

class CategoriasDetailView(generics.RetrieveAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    #permission_classes = [IsClienteUser]