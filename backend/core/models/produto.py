from django.db import models
from django.utils import timezone
from .categoria import Categoria
from .marca import Marca

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

    def get_price_with_discount(self):
        now = timezone.now()
        print(f"Data atual: {now}")  # Debug: Mostra a data atual

        # Converter para o fuso horário UTC
        data_inicio_utc = self.promocao.filter().values_list('data_inicio', flat=True).first()
        data_fim_utc = self.promocao.filter().values_list('data_fim', flat=True).first()
        
        # Verifica se há promoção ativa diretamente no produto
        promocao_produto = self.promocao.filter(
            data_inicio__lte=now, 
            data_fim__gte=now
        ).first()
        print(f"Promoção do produto encontrada: {promocao_produto}")  # Debug: Mostra a promoção do produto

        if promocao_produto:
            if promocao_produto.percentual:
                valor_desconto = self.preco_venda * (promocao_produto.percentual / 100)
                preco_promocional = self.preco_venda - valor_desconto
                print(f"Preço promocional calculado: {preco_promocional}")  # Debug: Mostra o preço calculado
            elif promocao_produto.valor_promocao:
                preco_promocional = self.preco_venda - promocao_produto.valor_promocao
                #preco_promocional = promocao_produto.valor_promocao
                print(f"Preço promocional definido pelo valor da promoção: {preco_promocional}")  # Debug
            return {'preco_anterior': self.preco_venda, 'preco_promocional': preco_promocional}

        # Verifica se há promoção ativa na categoria do produto
        if self.categoria:
            categoria_promocao = self.categoria.promocao.filter(
                data_inicio__lte=now,
                data_fim__gte=now
            ).first()
            print(f"Promoção da categoria encontrada: {categoria_promocao}")  # Debug

            if categoria_promocao:
                if categoria_promocao.percentual:
                    valor_desconto = self.preco_venda * (categoria_promocao.percentual / 100)
                    preco_promocional = self.preco_venda - valor_desconto
                    print(f"Preço promocional calculado pela categoria: {preco_promocional}")  # Debug
                elif categoria_promocao.valor_promocao:
                    preco_promocional = categoria_promocao.valor_promocao
                    print(f"Preço promocional definido pelo valor da promoção da categoria: {preco_promocional}")  # Debug
                return {'preco_anterior': self.preco_venda, 'preco_promocional': preco_promocional}

        # Sem promoção ativa
        print("Nenhuma promoção ativa encontrada.")  # Debug
        return {'preco_anterior': self.preco_venda, 'preco_promocional': None}