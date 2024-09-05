from django.db import models
from .pedido import Pedido

class Pagamento(models.Model):
    PAGO = 'Pago'
    PENDENTE = 'Pendente'
    STATUS_CHOICES = [
        (PAGO, 'Pago'),
        (PENDENTE, 'Pendente'),
    ]

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pagamento = models.CharField(max_length=50)
    status_pagamento = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
    data_pagamento = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pagamento'

    def __str__(self):
        return f"Pagamento do Pedido {self.pedido.id}"