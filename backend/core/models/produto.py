from django.db import models
from django.utils import timezone
from .categoria import Categoria
from .marca import Marca
from .tipo_licor import TipoLicor

class Produto(models.Model):
    ATIVO = 'Ativo'
    INATIVO = 'Inativo'
    STATUS_CHOICES = [
        (ATIVO, 'Ativo'),
        (INATIVO, 'Inativo'),
    ]

    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    preco_custo = models.DecimalField(max_digits=10, decimal_places=2)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=ATIVO)
    teor_alcoolico = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    volume = models.CharField(max_length=50, null=True, blank=True)
    marca = models.ForeignKey(Marca, on_delete=models.SET_NULL, null=True, blank=True)
    data_adicionado = models.DateTimeField(auto_now_add=True)
    data_modificado = models.DateTimeField(auto_now=True)
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    largura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    comprimento = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'produto'

    def __str__(self):
        return self.nome
    def get_desconto_aplicavel(self):
        """
        Retorna o desconto aplicável para o produto, considerando
        descontos específicos do produto, categoria e tipo de licor.
        """
        descontos_produto = self.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())
        descontos_categoria = self.categoria.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())
        descontos_tipo = self.tipo_licor.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())

        # Prioridade de desconto: Produto > Categoria > Tipo de Licor
        if descontos_produto.exists():
            return descontos_produto.first()  # Retorna o primeiro desconto válido encontrado para o produto
        elif descontos_categoria.exists():
            return descontos_categoria.first()  # Retorna o primeiro desconto válido encontrado para a categoria
        elif descontos_tipo.exists():
            return descontos_tipo.first()  # Retorna o primeiro desconto válido encontrado para o tipo de licor
        return None  # Nenhum desconto aplicável
