from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer, CustomTokenObtainPairSerializer
from .models import Produto
from .serializers import ProductSerializer
from .permissions import IsAdminUser

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny] # Permitir que qualquer pessoa acesse este endpoint
    
class UsuarioListView(generics.ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny] # Permitir que qualquer pessoa acesse este endpoint

class UsuarioDetailView(generics.RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]  # Permitir que qualquer pessoa acesse este endpoint

class UsuarioDeleteView(generics.DestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]


# Permissão 
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


#PRODUTOS ADMIN
class ProducCreateView(generics.CreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

#PRODUTOS ADMIN
class ListProductView(generics.ListAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

#PRODUTOS ADMIN
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

#PRODUTOS ADMIN
class ProducDeleteView(generics.DestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
