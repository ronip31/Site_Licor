from rest_framework import viewsets
from ..models import Categoria
from ..serializers import CategoriaSerializer
from ..permissions import IsAdminUser
from rest_framework import serializers

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer