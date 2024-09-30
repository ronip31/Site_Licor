from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario, Produto, Categoria
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import ImagemProduto, Cupom, CarouselImage
from .models import Promocao, OpcaoFrete, ConfiguracaoFrete, Marca


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

    class Meta:
        model = ImagemProduto
        fields = ['uuid', 'produto', 'imagem', 'descricao_imagem', 'data_criacao']

    def get_imagem(self, obj):
        # Verifica se o objeto tem uma imagem e retorna a URL correta
        if obj.imagem:
            return obj.imagem.url  # Retorna a URL relativa da imagem
        return None
    


class ProductSerializer(serializers.ModelSerializer):
    imagens = ImagemProdutoSerializer(many=True, required=False)
    preco_promocional = serializers.SerializerMethodField()
    preco_anterior = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = ['uuid', 'id', 'nome', 'descricao', 'preco_custo', 'preco_venda', 'preco_promocional', 'preco_anterior', 'quantidade_estoque', 
            'categoria', 'status', 'teor_alcoolico', 'volume', 'marca', 'data_adicionado', 'data_modificado', 
            'altura', 'largura', 'comprimento', 'peso', 'imagens'
        ]

    def get_preco_promocional(self, obj):
        prices = obj.get_price_with_discount()
        return prices.get('preco_promocional')

    def get_preco_anterior(self, obj):
        prices = obj.get_price_with_discount()
        return prices.get('preco_anterior')


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
    produto_id = serializers.CharField(required=True)
    cep_destino = serializers.CharField(max_length=10, required=True)

    def validate_cep_destino(self, value):
        # Adicione aqui a validação de CEP se necessário
        return value


class PromocaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocao
        fields = '__all__'


class OpcaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcaoFrete
        fields = ['id', 'id_frete', 'nome', 'ativo']


class ConfiguracaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoFrete
        fields = ['cep_origem', 'desconto_frete', 'acrescimo_frete', 'dias_adicionais_entrega']

class CupomSerializer(serializers.ModelSerializer):
    produtos = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), many=True, required=False)
    categorias = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), many=True, required=False)
    clientes_exclusivos = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), many=True, required=False)

    class Meta:
        model = Cupom
        fields = [
            'id', 'codigo', 'descricao', 'tipo', 'valor', 'data_inicio', 'data_fim', 'ativo',
            'uso_maximo', 'uso_por_cliente', 'valor_minimo_compra', 'valor_maximo_desconto',
            'produtos', 'categorias', 'clientes_exclusivos'
        ]

    def validate(self, data):
        # Validações personalizadas
        if data['tipo'] == 'percentual' and not data.get('valor'):
            raise serializers.ValidationError("Para cupons percentuais, o campo 'valor' é obrigatório.")
        if data['tipo'] == 'valor' and not data.get('valor'):
            raise serializers.ValidationError("Para cupons de valor fixo, o campo 'valor' é obrigatório.")
        if data['tipo'] == 'frete_gratis' and data.get('valor') is not None:
            raise serializers.ValidationError("Para cupons de frete grátis, o campo 'valor' deve ser nulo.")
        return data
    
class CarouselImageAdminSerializer(serializers.ModelSerializer):
    imagem = serializers.ImageField(required=False, allow_null=True) 

    class Meta:
        model = CarouselImage
        fields = '__all__'

    def update(self, instance, validated_data):
        imagem = validated_data.pop('imagem', None)
        
        # Atualiza os outros campos normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Lógica para lidar com a imagem
        if imagem is None:
            # Se imagem é None, remover a imagem atual
            instance.imagem.delete(save=False)
            instance.imagem = None
        elif imagem:
            # Se uma nova imagem foi enviada, substituir
            instance.imagem = imagem
        
        instance.save()
        return instance
    
    def get_imagem(self, obj):
        request = self.context.get('request')
        if obj.imagem:
            return request.build_absolute_uri(obj.imagem.url)
        return None
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    

class CarouselImageClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselImage
        fields = ['uuid', 'titulo', 'imagem', 'link_url']