from rest_framework import serializers
from ..models import Carrinho, ItemCarrinho
from core.serializers import ProdutoSerializerCarrinho

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializerCarrinho(read_only=True)

    class Meta:
        model = ItemCarrinho
        fields = ['carrinho','produto', 'quantidade']

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrinho
        fields = ['uuid', 'itens', 'criado_em', 'atualizado_em', 'session_id']
