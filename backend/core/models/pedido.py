from django.db import models
from .usuario import Usuario
class Pedido(models.Model):
    PENDENTE = 'Pendente'
    PROCESSANDO = 'Processando'
    ENVIADO = 'Enviado'
    STATUS_CHOICES = [
        (PENDENTE, 'Pendente'),
        (PROCESSANDO, 'Processando'),
        (ENVIADO, 'Enviado'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    data_pedido = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'pedido'

    def __str__(self):
        return f"Pedido {self.id} - {self.usuario.nome}"