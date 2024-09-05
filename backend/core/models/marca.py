from django.db import models

class Marca(models.Model):
    nome = models.CharField(max_length=255, null=True)
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'marca'

    def __str__(self):
        return self.nome