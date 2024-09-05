from django.db import models
from .administrador import Administrador

class LogAcao(models.Model):
    admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)
    acao = models.TextField()
    data_acao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'log_acao'

    def __str__(self):
        return f"Ação de {self.admin.nome} em {self.data_acao}"