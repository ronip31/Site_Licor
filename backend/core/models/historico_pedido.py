from django.db import models
from .pedido import Pedido
from .administrador import Administrador

class HistoricoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    status_antigo = models.CharField(max_length=50)
    status_novo = models.CharField(max_length=50)
    data_modificacao = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'historico_pedido'

    def __str__(self):
        return f"Histórico do Pedido {self.pedido.id}"