from rest_framework import serializers
from ..models import Cupom, Produto, Categoria, Usuario

class CupomSerializer(serializers.ModelSerializer):
    produtos = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), many=True, required=False)
    categorias = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), many=True, required=False)
    clientes_exclusivos = serializers.SlugRelatedField(
        queryset=Usuario.objects.all(),
        slug_field='uuid',  # Use o UUID como campo de referência
        many=True,
        required=False
    )

    class Meta:
        model = Cupom
        fields = [
            'id', 'codigo' ,'descricao', 'tipo', 'valor', 'data_inicio', 'data_fim', 'ativo',
            'uso_maximo', 'uso_por_cliente', 'valor_minimo_compra', 'valor_maximo_desconto',
            'produtos', 'categorias', 'clientes_exclusivos', 'permitir_combinacao_com_promocoes'
        ]