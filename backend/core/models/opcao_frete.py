from django.db import models

class OpcaoFrete(models.Model):
    id_frete = models.IntegerField(unique=True)  # ID da opção de frete fornecido pela API
    nome = models.CharField(max_length=255)  # Nome da opção de frete (e.g., "PAC", "SEDEX")
    ativo = models.BooleanField(default=False)  # Indica se a opção de frete está ativa ou não

    class Meta:
        db_table = 'opcao_frete'

    def __str__(self):
        return self.nome
