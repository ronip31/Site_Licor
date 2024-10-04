from django.db import models
from django.utils import timezone
from .produto import Produto
from .categoria import Categoria
from .usuario import Usuario
from decimal import Decimal

class Cupom(models.Model):
    TIPO_CHOICES = [
        ('percentual', 'Percentual'),
        ('valor', 'Valor Fixo'),
        ('frete_gratis', 'Frete Grátis'),
    ]

    codigo = models.CharField(max_length=50, unique=True)
    descricao = models.TextField(blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Usado para valor fixo ou percentual
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    ativo = models.BooleanField(default=True)

    uso_maximo = models.IntegerField(null=True, blank=True)  # Quantas vezes o cupom pode ser usado no total
    uso_por_cliente = models.IntegerField(null=True, blank=True)  # Quantas vezes o cupom pode ser usado por cliente
    valor_minimo_compra = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_maximo_desconto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Limite para cupons percentuais

    produtos = models.ManyToManyField(Produto, blank=True)  # Produtos específicos aplicáveis
    categorias = models.ManyToManyField(Categoria, blank=True)  # Categorias específicas aplicáveis
    clientes_exclusivos = models.ManyToManyField(Usuario, blank=True)  # Clientes específicos aplicáveis

    class Meta:
        db_table = 'cupom'

    def __str__(self):
        return f"{self.codigo} - {self.tipo}"

    def is_active(self):
        now = timezone.now()
        return self.ativo and self.data_inicio <= now <= self.data_fim
