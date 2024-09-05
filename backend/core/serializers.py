from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario, Produto, Categoria
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import ImagemProduto
from .models import Desconto, OpcaoFrete, ConfiguracaoFrete, Marca


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'password', 'telefone', 'data_criacao']
        extra_kwargs = {'password': {'write_only': True}}  # Para evitar que a senha seja exibida nas respostas

    def create(self, validated_data):
        # Criptografa a senha antes de salvar o usuário
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class ImagemProdutoSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()  # Use SerializerMethodField para customizar o campo
     # Serializers para os campos relacionados
    
    class Meta:
        model = ImagemProduto
        fields = ['id', 'produto', 'imagem', 'descricao_imagem']

    def get_imagem(self, obj):
        # Verifica se o objeto tem uma imagem e retorna a URL correta
        if obj.imagem:
            return obj.imagem.url  # Retorna a URL relativa da imagem
        return None
    


class ProductSerializer(serializers.ModelSerializer):
    imagens = ImagemProdutoSerializer(many=True, required=False)

    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'descricao', 'preco_custo', 'preco_venda', 'quantidade_estoque', 'categoria', 'sku', 
            'status', 'teor_alcoolico', 'volume', 'marca', 'data_adicionado', 'data_modificado', 
            'altura', 'largura', 'comprimento', 'peso', 'imagens'
        ]

    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens', None)
        produto = Produto.objects.create(**validated_data)
        if imagens_data:
            for imagem_data in imagens_data:
                ImagemProduto.objects.create(produto=produto, **imagem_data)
        return produto

    def update(self, instance, validated_data):
        imagens_data = validated_data.pop('imagens', None)

        # Atualiza os campos simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


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
    
        
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'descricao']


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nome', 'descricao']


class CalculoFreteSerializer(serializers.Serializer):
    produto_id = serializers.IntegerField(required=True)
    cep_destino = serializers.CharField(max_length=10, required=True)

    def validate_cep_destino(self, value):
        # Adicione aqui a validação de CEP se necessário
        return value


class DescontoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desconto
        fields = '__all__'


class OpcaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcaoFrete
        fields = ['id', 'id_frete', 'nome', 'ativo']


class ConfiguracaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoFrete
        fields = ['cep_origem', 'desconto_frete', 'acrescimo_frete', 'dias_adicionais_entrega']
