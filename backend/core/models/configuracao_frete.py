from django.db import models

class ConfiguracaoFrete(models.Model):
    cep_origem = models.CharField(max_length=10, null=False, blank=False)  # Este campo é obrigatório
    desconto_frete = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, null=True, blank=True)  # Pode ser nulo
    acrescimo_frete = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, null=True, blank=True)  # Pode ser nulo
    dias_adicionais_entrega = models.IntegerField(default=0, null=True, blank=True)   # Dias adicionais que o administrador deseja adicionar ao prazo de entrega

    class Meta:
        db_table = 'configuracao_frete'

    def __str__(self):
        return f"Configuração de Frete - Origem: {self.cep_origem}"
