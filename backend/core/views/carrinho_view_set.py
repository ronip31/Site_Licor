from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Carrinho, ItemCarrinho
from ..serializers import CarrinhoSerializer
from core.models import Produto
import uuid

class CarrinhoViewSet(viewsets.ModelViewSet):
    serializer_class = CarrinhoSerializer

    def get_queryset(self):
        """
        Retorna o carrinho do usuário autenticado ou do session_id fornecido.
        """
        if self.request.user.is_authenticated:
            return Carrinho.objects.filter(usuario=self.request.user)
        
        session_id = self.request.data.get('session_id')
        if session_id:
            return Carrinho.objects.filter(session_id=session_id)
        return Carrinho.objects.none()

    def get_or_create_cart(self, request):
        """
        Obtém ou cria um carrinho associado ao usuário ou ao session_id.
        Caso o usuário tenha feito login, unifica o carrinho anônimo com o do usuário,
        mantendo o session_id no banco de dados.
        """
        session_id = request.data.get('session_id')

        if request.user.is_authenticated:
            # Primeiro, busca se há um carrinho já associado ao usuário logado
            carrinho_user, created = Carrinho.objects.get_or_create(
                usuario=request.user
            )

            # Se o carrinho do usuário não tiver um session_id, atualiza com o session_id atual
            if not carrinho_user.session_id and session_id:
                carrinho_user.session_id = session_id
                carrinho_user.save()

            # Agora verifica se há um carrinho anônimo (session_id) que precisa ser unificado
            if session_id:
                carrinhos_anonymous = Carrinho.objects.filter(session_id=session_id).exclude(usuario=request.user)

                if carrinhos_anonymous.exists():
                    carrinho_anonymous = carrinhos_anonymous.first()  # Usa o primeiro carrinho encontrado

                    # Transferir os itens do carrinho anônimo para o carrinho do usuário logado
                    for item in carrinho_anonymous.itens.all():
                        item_carrinho, created = ItemCarrinho.objects.get_or_create(
                            carrinho=carrinho_user,
                            produto=item.produto,
                            defaults={'quantidade': item.quantidade}
                        )
                        if not created:
                            item_carrinho.quantidade += item.quantidade
                            item_carrinho.save()

                    # Apaga o carrinho anônimo, já que os itens foram transferidos
                    carrinho_anonymous.delete()

            return carrinho_user
        else:
            # Para usuários anônimos, usa o session_id
            if not session_id:
                session_id = str(uuid.uuid4())
                request.session['session_id'] = session_id
            carrinho, created = Carrinho.objects.get_or_create(session_id=session_id)
            return carrinho




    @action(detail=False, methods=['post'])
    def listar(self, request):
        """
        Lista os itens do carrinho com base no session_id ou no usuário autenticado.
        """
        session_id = request.data.get('session_id')

        if request.user.is_authenticated:
            # Se o usuário estiver autenticado, tenta unir o carrinho anônimo e do usuário
            carrinho = self.get_or_create_cart(request)
        elif session_id:
            # Para usuários anônimos, tenta buscar pelo session_id
            carrinho = Carrinho.objects.filter(session_id=session_id).first()
        else:
            return Response({"detail": "session_id não fornecido."}, status=status.HTTP_400_BAD_REQUEST)

        if not carrinho or carrinho.itens.count() == 0:
            # Retorna o carrinho mesmo vazio, ao invés de um erro 404
            return Response(CarrinhoSerializer(carrinho).data, status=status.HTTP_200_OK)

        return Response(CarrinhoSerializer(carrinho).data)


    @action(detail=False, methods=['post'])
    def adicionar_item(self, request):
        """
        Adiciona um item ao carrinho.
        """
        produto_uuid = request.data.get('produto_uuid')
        quantidade = request.data.get('quantidade', 1)

        try:
            produto = Produto.objects.get(uuid=produto_uuid)
        except Produto.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        carrinho = self.get_or_create_cart(request)

        item_carrinho, created = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            produto=produto,
            defaults={'quantidade': quantidade}
        )

        if not created:
            item_carrinho.quantidade += int(quantidade)
            item_carrinho.save()

        return Response(CarrinhoSerializer(carrinho).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def remover_item(self, request):
        """
        Remove um item do carrinho.
        """
        produto_uuid = request.data.get('produto_uuid')

        try:
            produto = Produto.objects.get(uuid=produto_uuid)
            carrinho = self.get_or_create_cart(request)
            item_carrinho = ItemCarrinho.objects.get(carrinho=carrinho, produto=produto)
            item_carrinho.delete()

            # Verifica se o carrinho ficou vazio após a remoção
            if not carrinho.itens.exists():  # Se não houver mais itens no carrinho
                return Response(CarrinhoSerializer(carrinho).data, status=status.HTTP_200_OK)

            return Response({"detail": "Item removido do carrinho."}, status=status.HTTP_204_NO_CONTENT)

        except (Produto.DoesNotExist, ItemCarrinho.DoesNotExist):
            return Response({"error": "Produto ou item não encontrado."}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['post'])
    def atualizar_quantidade(self, request):
        """
        Atualiza a quantidade de um item no carrinho.
        """
        produto_uuid = request.data.get('produto_uuid')
        nova_quantidade = request.data.get('quantidade')

        if not nova_quantidade or int(nova_quantidade) <= 0:
            return Response({"error": "Quantidade inválida."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            produto = Produto.objects.get(uuid=produto_uuid)
            carrinho = self.get_or_create_cart(request)
            item_carrinho = ItemCarrinho.objects.get(carrinho=carrinho, produto=produto)

            item_carrinho.quantidade = int(nova_quantidade)
            item_carrinho.save()

            return Response({"detail": "Quantidade atualizada com sucesso."}, status=status.HTTP_200_OK)
        except (Produto.DoesNotExist, ItemCarrinho.DoesNotExist):
            return Response({"error": "Produto ou item não encontrado."}, status=status.HTTP_404_NOT_FOUND)
