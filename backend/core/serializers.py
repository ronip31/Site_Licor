from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario, Produto
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import ImagemProduto


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'password', 'telefone', 'data_criacao']
        extra_kwargs = {'password': {'write_only': True}}  # Para evitar que a senha seja exibida nas respostas

    def create(self, validated_data):
        # Criptografa a senha antes de salvar o usuário
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria', 'sku', 'status']
        

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Autentica o usuário usando o backend personalizado
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({
                "detail": "Usuário não encontrado",
                "code": "user_not_found"
            })

        # Gera o token de refresh e access
        refresh = self.get_token(user)

        # Adiciona informações personalizadas no payload do token
        refresh['tipo_usuario'] = user.tipo_usuario

        # Retorna apenas o token de acesso com o tipo de usuário incluído
        return {
            'access': str(refresh.access_token)
        }
    
class ImagemProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemProduto
        fields = ['id', 'produto', 'imagem', 'descricao_imagem']