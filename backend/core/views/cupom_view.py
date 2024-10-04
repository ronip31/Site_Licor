from rest_framework import viewsets, status
from rest_framework.response import Response
from ..permissions import IsAdminUser
from ..models import Cupom, Produto, Categoria, Usuario
from ..serializers import CupomSerializer
from ..services import CupomService
from rest_framework.views import APIView
from decimal import Decimal

class CuponsViewSet(viewsets.ModelViewSet):
    queryset = Cupom.objects.all()
    serializer_class = CupomSerializer
    #permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # Se o cache de objetos pré-carregados estiver presente, ele precisa ser invalidado
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AplicarCupomView(APIView):

    def post(self, request, *args, **kwargs):
        codigo_cupom = request.data.get('codigo_cupom')
        valor_compra = request.data.get('valor_compra')
        usuario = request.user if request.user.is_authenticated else None
        produtos = request.data.get('produtos', [])  # Lista de UUIDs de produtos
        categorias = request.data.get('categorias', [])  # Lista de IDs de categorias

        # Verifica se o cupom existe
        try:
            cupom = Cupom.objects.filter(codigo__iexact=codigo_cupom).first()
            if not cupom:
                return Response({"detail": "Cupom não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Cupom.DoesNotExist:
            return Response({"detail": "Erro ao buscar cupom"}, status=status.HTTP_404_NOT_FOUND)

        # Aplica a lógica de validação e aplicação do cupom
        try:
            desconto_info = CupomService.aplicar_cupom(cupom, valor_compra, usuario, produtos, categorias)
            return Response(desconto_info, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)