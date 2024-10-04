from rest_framework import serializers
from ..models import Promocao, Produto, Categoria

class PromocaoSerializer(serializers.ModelSerializer):
    produtos = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), many=True, required=False)
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), many=True, required=False)

    class Meta:
        model = Promocao
        fields = [
            'id', 'nome_promo', 'percentual', 'valor_promocao', 
            'data_inicio', 'data_fim', 'produtos', 'categoria'
        ]

    def create(self, validated_data):
        produtos_data = validated_data.pop('produtos')
        categorias_data = validated_data.pop('categoria')
        promocao = Promocao.objects.create(**validated_data)
        promocao.produtos.set(produtos_data)
        promocao.categoria.set(categorias_data)
        return promocao

    def update(self, instance, validated_data):
        produtos_data = validated_data.pop('produtos', None)
        categorias_data = validated_data.pop('categoria', None)

        instance = super().update(instance, validated_data)

        if produtos_data is not None:
            instance.produtos.set(produtos_data)
        if categorias_data is not None:
            instance.categoria.set(categorias_data)

        return instance