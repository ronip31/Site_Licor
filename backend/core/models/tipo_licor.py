from django.db import models

class TipoLicor(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tipo_licor'

    def __str__(self):
        return self.nome