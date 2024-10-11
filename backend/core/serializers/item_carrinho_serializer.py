from rest_framework import serializers
from ..models import Carrinho, ItemCarrinho
from core.serializers import ProdutoSerializer

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)

    class Meta:
        model = ItemCarrinho
        fields = ['uuid', 'produto', 'quantidade', 'preco_unitario']

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrinho
        fields = ['uuid', 'usuario', 'itens', 'criado_em', 'atualizado_em']
