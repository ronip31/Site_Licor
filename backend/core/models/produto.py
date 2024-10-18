from django.db import models
from django.utils import timezone
from .categoria import Categoria
from .marca import Marca
import uuid
from decimal import Decimal
from django.utils.text import slugify

class Produto(models.Model):
    ATIVO = 'Ativo'
    INATIVO = 'Inativo'
    STATUS_CHOICES = [
        (ATIVO, 'Ativo'),
        (INATIVO, 'Inativo'),
    ]

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    preco_custo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
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
    slug = models.SlugField(max_length=255, unique=True, db_index=True, blank=True, null=True)

    class Meta:
        db_table = 'produto'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super(Produto, self).save(*args, **kwargs)

    def get_price_with_discount(self):
        now = timezone.now()

        # Verifica se há promoção ativa diretamente no produto
        promocao_produto = self.promocoes.filter(data_inicio__lte=now, data_fim__gte=now).first()
        if promocao_produto:
            if promocao_produto.percentual:
                valor_desconto = self.preco_venda * (promocao_produto.percentual / 100)
                preco_promocional = self.preco_venda - valor_desconto
            elif promocao_produto.valor_promocao:
                preco_promocional = self.preco_venda - promocao_produto.valor_promocao
            # Garante que o preco_promocional tenha duas casas decimais
            preco_promocional = Decimal(preco_promocional).quantize(Decimal('0.01'))
            return {'preco_anterior': self.preco_venda, 'preco_promocional': preco_promocional}

        # Verifica se há promoção ativa na categoria do produto
        if self.categoria:
            categoria_promocao = self.categoria.promocoes.filter(data_inicio__lte=now, data_fim__gte=now).first()
            if categoria_promocao:
                if categoria_promocao.percentual:
                    valor_desconto = self.preco_venda * (categoria_promocao.percentual / 100)
                    preco_promocional = self.preco_venda - valor_desconto
                elif categoria_promocao.valor_promocao:
                    preco_promocional = self.preco_venda - categoria_promocao.valor_promocao
                # Garante que o preco_promocional tenha duas casas decimais
                preco_promocional = Decimal(preco_promocional).quantize(Decimal('0.01'))
                return {'preco_anterior': self.preco_venda, 'preco_promocional': preco_promocional}

        # Sem promoção ativa
        return {'preco_anterior': self.preco_venda}