from rest_framework import serializers
from ..models import Produto, ImagemProduto
from rest_framework import generics
from django.shortcuts import get_object_or_404

class ImagemProdutoSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = ImagemProduto
        fields = ['uuid', 'produto', 'imagem', 'descricao_imagem']

    def get_imagem(self, obj):
        if obj.imagem:
            return obj.imagem.url
        return None

class ImagemProdutoSerializerView(serializers.ModelSerializer):
    class Meta:
        model = ImagemProduto
        fields = ['uuid', 'imagem']


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


# class ProductClientSerializer(serializers.ModelSerializer):
#     preco_com_desconto = serializers.SerializerMethodField()

#     class Meta:
#         model = Produto
#         fields = ['uuid', 'nome', 'descricao', 'preco_venda', 'preco_com_desconto', 'quantidade_estoque', 'imagens']

#     def get_preco_com_desconto(self, obj):
#         # Obtenha o preço com desconto, se disponível
#         preco_info = obj.get_price_with_discount()
#         preco_promocional = preco_info.get('preco_promocional')
#         # Retorne None se não houver preço promocional
#         return preco_promocional if preco_promocional else None
    

# Utilizado para buscar informações para área do cliente 
class ProdutoSerializer(serializers.ModelSerializer):
    preco_com_desconto = serializers.SerializerMethodField()
    imagens = ImagemProdutoSerializerView(many=True, read_only=True)

    class Meta:
        model = Produto
        fields = ['uuid', 'nome', 'descricao', 'preco_venda', 'preco_com_desconto', 'quantidade_estoque', 'imagens']

    def get_preco_com_desconto(self, obj):
        # Obtenha o preço com desconto, se disponível
        preco_info = obj.get_price_with_discount()
        preco_promocional = preco_info.get('preco_promocional')
        # Retorne None se não houver preço promocional
        return preco_promocional if preco_promocional else None
    
# Utilizado na Rota de Cupoms - menos dados
class ProductCupomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Produto
        fields = ['uuid','id', 'nome', 'categoria']
