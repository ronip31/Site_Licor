from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        print("request", request)
        # Certifica-se de que o usuário está autenticado
        if not request.user.is_authenticated:
            return False
        
        # Verifica se o tipo de usuário é administrador
        return request.user.tipo_usuario == 'administrador'
    

class IsClienteUser(BasePermission):
    def has_permission(self, request, view):

        # Certifica-se de que o usuário está autenticado
        if not request.user.is_authenticated:
            return False

        return request.user.tipo_usuario == 'cliente'
