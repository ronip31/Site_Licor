from rest_framework import serializers
from ..models import Produto, ImagemProduto

class ImagemProdutoSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = ImagemProduto
        fields = ['uuid', 'produto', 'imagem', 'descricao_imagem', 'data_criacao']

    def get_imagem(self, obj):
        if obj.imagem:
            return obj.imagem.url
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
