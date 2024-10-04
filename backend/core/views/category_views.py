from rest_framework import viewsets
from ..models import Categoria, Marca
from ..serializers import CategoriaSerializer, MarcaSerializer
from ..permissions import IsAdminUser
from rest_framework import serializers

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer



class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    #permission_classes = [IsAdminUser]