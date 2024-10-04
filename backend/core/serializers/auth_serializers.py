from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from ..models import Usuario

class CustomAdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({"detail": "Usuário não encontrado", "code": "user_not_found"})
        if user.tipo_usuario != 'administrador':
            raise serializers.ValidationError({"detail": "Acesso negado", "code": "not_admin"})

        refresh = self.get_token(user)
        refresh['uuid'] = str(user.uuid)

        return {'access': str(refresh.access_token), 'uuid': str(user.uuid)}

class CustomClienteTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({"detail": "Usuário não encontrado", "code": "user_not_found"})
        if user.tipo_usuario != 'cliente':
            raise serializers.ValidationError({"detail": "Acesso negado", "code": "not_cliente"})

        refresh = self.get_token(user)
        refresh['uuid'] = str(user.uuid)

        return {'access': str(refresh.access_token), 'uuid': str(user.uuid)}
