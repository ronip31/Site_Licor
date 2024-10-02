from ..serializers import UsuarioSerializer, CustomAdminTokenObtainPairSerializer, CustomClienteTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Permissão 
class CustomTokenObtainPairViewAdmin(TokenObtainPairView):
    serializer_class = CustomAdminTokenObtainPairSerializer

class CustomTokenObtainPairViewCliente(TokenObtainPairView):
    serializer_class = CustomClienteTokenObtainPairSerializer