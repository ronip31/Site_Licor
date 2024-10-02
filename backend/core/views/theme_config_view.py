from rest_framework import viewsets
from ..models import ThemeConfig
from ..serializers import ThemeConfigSerializer
from rest_framework.permissions import AllowAny

class ThemeConfigViewSet(viewsets.ModelViewSet):
    queryset = ThemeConfig.objects.all()
    serializer_class = ThemeConfigSerializer
    http_method_names = ['get', 'put']  # Apenas 'get' e 'put' para ver e editar o tema
    permission_classes = [AllowAny]
