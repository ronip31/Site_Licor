from django.db import models
from .produto import Produto

class ImagemProduto(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='imagens')
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)  # Certifique-se que o campo está correto
    descricao_imagem = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'imagem_produto'

    def __str__(self):
        return f"Imagem de {self.produto.nome}"