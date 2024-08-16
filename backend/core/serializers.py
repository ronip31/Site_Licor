from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'senha', 'telefone', 'tipo_usuario', 'data_criacao']
        extra_kwargs = {'senha': {'write_only': True}}  # Para evitar que a senha seja exibida nas respostas
