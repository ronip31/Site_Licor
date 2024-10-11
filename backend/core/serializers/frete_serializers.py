from rest_framework import serializers
from ..models import OpcaoFrete, ConfiguracaoFrete

class CalculoFreteSerializer(serializers.Serializer):
    produto_uuid = serializers.UUIDField()
    cep_destino = serializers.CharField(max_length=10, required=True)

    def validate_cep_destino(self, value):
        return value

class OpcaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcaoFrete
        fields = ['id', 'id_frete', 'nome', 'ativo']

class ConfiguracaoFreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoFrete
        fields = ['cep_origem', 'desconto_frete', 'acrescimo_frete', 'dias_adicionais_entrega']
