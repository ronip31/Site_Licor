from django.db import models
from core.models import Produto
from ..models import Usuario
import uuid
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class Carrinho(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, null=True, blank=True)
    session_id = models.TextField(blank=True, null=True)
    usuario = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = 'carrinho'

    def __str__(self):
        return f'Carrinho de {self.usuario.nome if self.usuario else self.session_id}'
    
    @csrf_exempt
    def adicionar_item_ao_carrinho(request):
        data = json.loads(request.body)
        produto_uuid = data.get('produto_uuid')
        quantidade = data.get('quantidade', 1)
        session_id = data.get('session_id')
        usuario_uuid = data.get('usuario_uuid')  # Opcional se o usuário estiver logado

        try:
            produto = Produto.objects.get(uuid=produto_uuid)

            # Verifica se o usuário está logado
            if usuario_uuid:
                carrinho, _ = Carrinho.objects.get_or_create(usuario_id=usuario_uuid)
            else:
                carrinho, _ = Carrinho.objects.get_or_create(session_id=session_id)

            # Verifica se o item já está no carrinho
            item_carrinho, created = ItemCarrinho.objects.get_or_create(
                carrinho=carrinho,
                produto=produto,
                defaults={'quantidade': quantidade, 'preco_unitario': produto.preco_venda}
            )

            # Se o item já existia no carrinho, atualiza a quantidade
            if not created:
                item_carrinho.quantidade += quantidade
                item_carrinho.save()

            # Atualiza a data de modificação do carrinho
            carrinho.save()

            # Retorna o carrinho atualizado
            return JsonResponse({'message': 'Item adicionado ao carrinho com sucesso!'}, status=200)

        except Produto.DoesNotExist:
            return JsonResponse({'error': 'Produto não encontrado.'}, status=404)

class ItemCarrinho(models.Model):
    carrinho = models.ForeignKey(Carrinho, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'item_carrinho'

    def __str__(self):
        return f'{self.produto.nome} - {self.quantidade} unidades'
