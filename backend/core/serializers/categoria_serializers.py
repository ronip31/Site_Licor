from rest_framework import serializers
from ..models import Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class CategoriaSerializerNome(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['nome'] 