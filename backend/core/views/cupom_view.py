from rest_framework import viewsets, status
from rest_framework.response import Response
from ..permissions import IsAdminUser
from ..models import Cupom, Produto, Categoria, Usuario
from ..serializers import CupomSerializer
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


class CuponsDetailView(APIView):
    def post(self, request, *args, **kwargs):
        codigo = request.data.get('codigo')
        valor_compra = Decimal(request.data.get('valor_compra', '0'))
        produto_id = request.data.get('produto_id')
        usuario_id = request.data.get('usuario_id')

        try:
            # Tenta encontrar o cupom com o código fornecido
            cupom = Cupom.objects.get(codigo=codigo)

            # Verifica se o cupom está ativo
            if not cupom.is_active():
                return Response({'erro': 'Cupom expirado ou inativo.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o valor mínimo de compra é atendido
            if valor_compra < cupom.valor_minimo_compra:
                return Response({'erro': 'O valor da compra é menor que o mínimo exigido para o cupom.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o cupom é aplicável ao produto
            if produto_id and not cupom.produtos.filter(id=produto_id).exists():
                return Response({'erro': 'Cupom não aplicável a este produto.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o cupom é aplicável ao usuário
            if usuario_id and cupom.clientes_exclusivos.exists() and not cupom.clientes_exclusivos.filter(id=usuario_id).exists():
                return Response({'erro': 'Cupom não aplicável a este usuário.'}, status=status.HTTP_400_BAD_REQUEST)

            # Calcula o desconto aplicável
            desconto = cupom.aplicar_cupom(valor_compra)
            valor_final = valor_compra - desconto

            return Response({'desconto': desconto, 'valor_final': valor_final}, status=status.HTTP_200_OK)

        except Cupom.DoesNotExist:
            return Response({'erro': 'Cupom não encontrado.'}, status=status.HTTP_404_NOT_FOUND)