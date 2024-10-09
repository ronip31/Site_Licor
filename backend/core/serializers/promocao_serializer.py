from rest_framework import serializers
from ..models import Promocao, Produto, Categoria

class PromocaoSerializer(serializers.ModelSerializer):
    produtos = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), many=True, required=False)
    categorias = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), many=True, required=False)  # Mudado para plural

    class Meta:
        model = Promocao
        fields = [
            'id', 'nome_promo', 'percentual', 'valor_promocao', 
            'data_inicio', 'data_fim', 'produtos', 'categorias' 
        ]
