from django.db import models

class Configuracao(models.Model):
    chave = models.CharField(max_length=255)
    valor = models.CharField(max_length=255)

    class Meta:
        db_table = 'configuracao'

    def __str__(self):
        return self.chave