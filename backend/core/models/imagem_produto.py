from django.db import models
from .produto import Produto
import uuid
from django.utils import timezone

class ImagemProduto(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE, related_name='imagens')
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)
    descricao_imagem = models.CharField(max_length=255, blank=True, null=True)
    data_criacao = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'imagem_produto'

    def __str__(self):
        return f"Imagem de {self.produto.nome}"
