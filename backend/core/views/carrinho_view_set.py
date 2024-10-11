from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Carrinho, ItemCarrinho
from ..serializers import CarrinhoSerializer, ItemCarrinhoSerializer
from core.models import Produto

class CarrinhoViewSet(viewsets.ModelViewSet):
    serializer_class = CarrinhoSerializer

    def get_queryset(self):
        return Carrinho.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['post'])
    def adicionar_item(self, request):
        produto_uuid = request.data.get('produto_uuid')
        quantidade = request.data.get('quantidade', 1)
        
        try:
            produto = Produto.objects.get(uuid=produto_uuid)
        except Produto.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        carrinho, created = Carrinho.objects.get_or_create(usuario=request.user)
        item_carrinho, created = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            produto=produto,
            defaults={'quantidade': quantidade, 'preco_unitario': produto.preco_venda}
        )

        if not created:
            item_carrinho.quantidade += int(quantidade)
            item_carrinho.save()

        return Response(CarrinhoSerializer(carrinho).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def listar(self, request):
        carrinho = self.get_queryset().first()
        if not carrinho:
            return Response({"detail": "Carrinho vazio."}, status=status.HTTP_404_NOT_FOUND)
        return Response(CarrinhoSerializer(carrinho).data)

    @action(detail=False, methods=['post'])
    def remover_item(self, request):
        produto_uuid = request.data.get('produto_uuid')

        try:
            produto = Produto.objects.get(uuid=produto_uuid)
            carrinho = Carrinho.objects.get(usuario=request.user)
            item_carrinho = ItemCarrinho.objects.get(carrinho=carrinho, produto=produto)
            item_carrinho.delete()

            return Response({"detail": "Item removido do carrinho."}, status=status.HTTP_204_NO_CONTENT)
        except (Produto.DoesNotExist, Carrinho.DoesNotExist, ItemCarrinho.DoesNotExist):
            return Response({"error": "Produto ou item não encontrado."}, status=status.HTTP_404_NOT_FOUND)
