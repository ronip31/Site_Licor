from rest_framework import generics
from ..models import Usuario
from ..serializers import UsuarioSerializer
from ..permissions  import IsAdminUser, IsClienteUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    #permission_classes = [IsAdminUser]

class UsuarioListView(generics.ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    #permission_classes = [IsAdminUser]

class UsuarioMeView(APIView):
    """
    View que retorna os dados do usuário autenticado com base no token JWT.
    Inclui o tipo de usuário na resposta.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user  # O usuário autenticado já está disponível em request.user
        serializer = UsuarioSerializer(usuario)
        
        # Inclui o tipo de usuário na resposta
        response_data = serializer.data
        response_data['tipo_usuario'] = usuario.tipo_usuario  # Certifique-se de que `tipo_usuario` está no modelo

        return Response(response_data, status=status.HTTP_200_OK)
    
class UsuarioDeleteView(generics.DestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    #permission_classes = [IsAdminUser]
