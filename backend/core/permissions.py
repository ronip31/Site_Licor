from rest_framework.permissions import BasePermission
from core.models import Usuario  # Importe o seu modelo de usuário

class IsAdminUser(BasePermission):
    """
    Permissão que garante que o usuário autenticado é um administrador.
    Faz a verificação diretamente no banco de dados ao invés de confiar em informações no token.
    """

    def has_permission(self, request, view):
        # Certifica-se de que o usuário está autenticado
        if not request.user.is_authenticated:
            return False
        
        # Obtém o UUID do usuário a partir do token JWT (em vez de usar o user.id)
        uuid = request.auth.payload.get('uuid')

        if not uuid:
            return False
        
        # Busca o usuário no banco de dados para verificar o tipo
        try:
            usuario = Usuario.objects.get(uuid=uuid)
            return usuario.tipo_usuario == 'administrador'
        except Usuario.DoesNotExist:
            return False  # Caso o usuário não exista, nega o acesso
        

class IsClienteUser(BasePermission):
    """
    Permissão que garante que o usuário autenticado é um cliente.
    Faz a verificação diretamente no banco de dados ao invés de confiar em informações no token.
    """

    def has_permission(self, request, view):
        # Certifica-se de que o usuário está autenticado
        if not request.user.is_authenticated:
            return False
        
        # Obtém o UUID do usuário a partir do token JWT (em vez de usar o user.id)
        uuid = request.auth.payload.get('uuid')

        if not uuid:
            return False

        # Busca o usuário no banco de dados para verificar o tipo
        try:
            usuario = Usuario.objects.get(uuid=uuid)
            return usuario.tipo_usuario == 'cliente'
        except Usuario.DoesNotExist:
            return False  # Caso o usuário não exista, nega o acesso
