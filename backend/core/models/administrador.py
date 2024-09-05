from django.db import models

class Administrador(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'administrador'

    def __str__(self):
        return self.nomes