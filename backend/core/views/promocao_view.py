from rest_framework import viewsets
from ..models import Promocao
from ..serializers import PromocaoSerializer
from ..serializers import  PromocaoSerializer
from rest_framework import viewsets
from ..permissions import IsAdminUser
from rest_framework import serializers

class PromocaoViewSet(viewsets.ModelViewSet):
    queryset = Promocao.objects.all()
    serializer_class = PromocaoSerializer