from rest_framework import generics
from ..models import Promocao
from ..serializers import PromocaoSerializer
from rest_framework import viewsets

class PromocaoViewSet(viewsets.ModelViewSet):
    queryset = Promocao.objects.all()
    serializer_class = PromocaoSerializer