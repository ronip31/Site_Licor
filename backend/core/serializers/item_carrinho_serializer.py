from rest_framework import serializers
from ..models import Carrinho, ItemCarrinho
from core.serializers import ProdutoSerializerCarrinho, ImagemProdutoSerializerView

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializerCarrinho(read_only=True)

    class Meta:
        model = ItemCarrinho
        fields = ['carrinho','produto', 'quantidade']

        def validate_quantidade(self, value):
            if value <= 0:
                raise serializers.ValidationError("A quantidade deve ser um número positivo.")
            return value

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    imagens = ImagemProdutoSerializerView(many=True, read_only=True)

    class Meta:
        model = Carrinho
        fields = ['uuid', 'itens', 'criado_em', 'atualizado_em','imagens', 'session_id']

        def validate_quantidade(self, value):
            if value <= 0:
                raise serializers.ValidationError("A quantidade deve ser um número positivo.")
            return value
