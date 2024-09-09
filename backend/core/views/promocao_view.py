from rest_framework import generics
from ..models import Promocao
from ..serializers import PromocaoSerializer
from rest_framework import viewsets
from ..permissions import IsAdminUser

class PromocaoViewSet(viewsets.ModelViewSet):
    queryset = Promocao.objects.all()
    serializer_class = PromocaoSerializer
    #permission_classes = [IsAdminUser]