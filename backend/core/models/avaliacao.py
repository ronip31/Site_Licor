from django.db import models
from .produto import Produto
from .usuario import Usuario

class Avaliacao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nota = models.IntegerField()
    comentario = models.TextField(blank=True, null=True)
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'avaliacao'

    def __str__(self):
        return f"Avaliação de {self.usuario.nome} para {self.produto.nome}"