from rest_framework import generics
from ..models import Desconto
from ..serializers import DescontoSerializer

class DescontoCreateView(generics.CreateAPIView):
    queryset = Desconto.objects.all()
    serializer_class = DescontoSerializer
    #permission_classes = [IsAdminUser]

class DescontoListView(generics.ListAPIView):
    queryset = Desconto.objects.all()
    serializer_class = DescontoSerializer
    #permission_classes = [IsAdminUser]
