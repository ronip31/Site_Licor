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
    produtos = models.ManyToManyField(Produto, blank=True, null=True, related_name='promocoes')  # Relacionamento para múltiplos produtos
    categoria = models.ManyToManyField(Categoria, blank=True, null=True, related_name='promocoes')

    class Meta:
        db_table = 'promocao'

    def __str__(self):
        return f"Promocao de {self.percentual}% - {self.nome_promo or 'Sem Nome'}"

    def get_aplicacao(self):
        aplicacoes = []
        if self.produtos.exists():
            aplicacoes.append(f"Produtos: {', '.join(produto.nome for produto in self.produtos.all())}")
        if self.categoria:
            aplicacoes.append(f"Categoria: {self.categoria.nome}")
        if not aplicacoes:
            return "Promocao geral"
        return ", ".join(aplicacoes)

    def is_active(self):
        now = timezone.now()
        return self.data_inicio <= now <= self.data_fim
