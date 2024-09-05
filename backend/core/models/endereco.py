from django.db import models
from .usuario import Usuario

class Endereco(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    endereco = models.TextField()
    cidade = models.CharField(max_length=200)
    estado = models.CharField(max_length=100)
    cep = models.CharField(max_length=20)
    pais = models.CharField(max_length=100)

    class Meta:
        db_table = 'endereco'

    def __str__(self):
        return f"Endereço de {self.usuario.nome}"