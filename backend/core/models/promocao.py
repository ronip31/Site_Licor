from django.db import models
from django.utils import timezone
from .produto import Produto
from .categoria import Categoria

class Promocao(models.Model):
    percentual = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    valor_promocao = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    nome_promo = models.TextField(blank=True, null=True)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='promocao', null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='promocao', null=True, blank=True)

    class Meta:
        db_table = 'promocao'

    def __str__(self):
        return f"Promocao de {self.percentual}%"

    def get_aplicacao(self):
        aplicacoes = []
        if self.produto:
            aplicacoes.append(f"Produto: {self.produto.nome}")
        if self.categoria:
            aplicacoes.append(f"Categoria: {self.categoria.nome}")

        if aplicacoes:
            return ", ".join(aplicacoes)
        return "Promocao geral"

    def is_active(self):
        now = timezone.now()
        return self.data_inicio <= now <= self.data_fim
