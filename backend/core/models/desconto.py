from django.db import models
from django.utils import timezone
from .produto import Produto
from .usuario import Usuario
from .categoria import Categoria
from .tipo_licor import TipoLicor

class Desconto(models.Model):
    percentual = models.DecimalField(max_digits=5, decimal_places=2)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    descricao = models.TextField(blank=True, null=True)

    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True)
    tipo_licor = models.ForeignKey(TipoLicor, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True)
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True)

    class Meta:
        db_table = 'desconto'

    def __str__(self):
        return f"Desconto de {self.percentual}%"

    def get_aplicacao(self):
        aplicacoes = []
        if self.produto:
            aplicacoes.append(f"Produto: {self.produto.nome}")
        if self.categoria:
            aplicacoes.append(f"Categoria: {self.categoria.nome}")
        if self.tipo_licor:
            aplicacoes.append(f"Tipo de Licor: {self.tipo_licor.nome}")
        if self.cliente:
            aplicacoes.append(f"Cliente: {self.cliente.nome}")

        if aplicacoes:
            return ", ".join(aplicacoes)
        return "Desconto geral"

    def is_active(self):
        now = timezone.now()
        return self.data_inicio <= now <= self.data_fim
