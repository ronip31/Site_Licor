from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Carrinho, ItemCarrinho
from ..serializers import CarrinhoSerializer, ProdutoSerializerCarrinho
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
        Caso o usuário tenha feito login, o carrinho anônimo é mesclado com o carrinho do usuário logado,
        e o session_id mais recente é atribuído ao carrinho do usuário.
        """
        session_id = request.data.get('session_id')

        if request.user.is_authenticated:
            # Tenta buscar o carrinho anônimo (não logado) com o session_id
            carrinho_anonymous = None
            if session_id:
                carrinho_anonymous = Carrinho.objects.filter(session_id=session_id, usuario__isnull=True).first()

            # Verifica se o usuário já tem um carrinho associado à conta
            carrinho_user, created = Carrinho.objects.get_or_create(usuario=request.user)

            if carrinho_anonymous:
                # Mescla os itens do carrinho anônimo com o carrinho do usuário logado
                for item in carrinho_anonymous.itens.all():
                    # Verifica se o item já está no carrinho do usuário
                    item_carrinho, created = ItemCarrinho.objects.get_or_create(
                        carrinho=carrinho_user,
                        produto=item.produto,
                        defaults={'quantidade': item.quantidade}
                    )
                    if not created:
                        # Se o item já existir no carrinho do usuário, soma as quantidades
                        item_carrinho.quantidade += item.quantidade
                        item_carrinho.save()

                # Apaga o carrinho anônimo, já que os itens foram transferidos
                carrinho_anonymous.delete()

            # Atualiza o session_id do carrinho do usuário com o session_id mais recente
            if session_id and carrinho_user.session_id != session_id:
                carrinho_user.session_id = session_id
                carrinho_user.save()

            return carrinho_user

        else:
            # Para usuários anônimos (não logados), cria ou obtém um carrinho pelo session_id
            if not session_id:
                session_id = str(uuid.uuid4())
                request.session['session_id'] = session_id
            carrinho, created = Carrinho.objects.get_or_create(session_id=session_id)
            return carrinho


    @action(detail=False, methods=['post'])
    def listar(self, request):
        """
        Lista os itens do carrinho com base no session_id ou no usuário autenticado,
        incluindo o cálculo do valor total do carrinho e imagens dos produtos.
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
            # Retorna o carrinho mesmo vazio
            return Response({
                "uuid": carrinho.uuid if carrinho else None,
                "itens": [],
                "total_carrinho": 0,
                "session_id": session_id
            }, status=status.HTTP_200_OK)

        # Cálculo do valor total por item e do carrinho
        total_carrinho = 0
        itens_detalhados = []
        for item in carrinho.itens.all():
            # Utilize o serializador para obter o preço com desconto
            produto_serializado = ProdutoSerializerCarrinho(item.produto).data
            preco_unitario = produto_serializado.get('preco_com_desconto') or produto_serializado.get('preco_venda')
            total_item = float(preco_unitario) * item.quantidade
            total_carrinho += total_item

            # Adiciona detalhes de cada item, incluindo imagens e a quantidade
            imagens = [imagem['imagem'] for imagem in produto_serializado.get('imagens', [])]

            itens_detalhados.append({
                "produto": {
                    "uuid": item.produto.uuid,
                    "nome": item.produto.nome,
                    "preco_unitario": float(preco_unitario),
                    "quantidade": item.quantidade,  # Quantidade adicionada
                    "total_item": total_item,
                    "imagens": imagens  # Adiciona a lista de imagens
                }
            })

        # Retorna o carrinho com os cálculos e as imagens
        return Response({
            "uuid": carrinho.uuid,
            "itens": itens_detalhados,
            "total_carrinho": total_carrinho,
            "session_id": carrinho.session_id
        }, status=status.HTTP_200_OK)



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

        # Obtém ou cria o carrinho
        carrinho = self.get_or_create_cart(request)

        # Verifica se o item já está no carrinho
        try:
            item_carrinho = ItemCarrinho.objects.get(carrinho=carrinho, produto=produto)
            # Se o item já existir, atualiza a quantidade
            item_carrinho.quantidade += int(quantidade)
            item_carrinho.save()
        except ItemCarrinho.DoesNotExist:
            # Se não existir, cria um novo item no carrinho
            ItemCarrinho.objects.create(carrinho=carrinho, produto=produto, quantidade=quantidade)

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
