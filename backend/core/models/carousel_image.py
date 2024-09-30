from django.db import models
import uuid
from django.utils import timezone

class CarouselImage(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    titulo = models.CharField(max_length=255, blank=True, null=True)
    imagem = models.ImageField(upload_to='carousel/', blank=True, null=True)
    ordem = models.PositiveIntegerField(
        default=0,
        help_text="Define a ordem em que as imagens aparecem no carrossel."
    )
    ativo = models.BooleanField(default=True)
    link_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="URL para onde o usuário será redirecionado ao clicar na imagem."
    )
    data_inicio = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Data e hora de início da exibição."
    )
    data_fim = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Data e hora de término da exibição."
    )
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'carousel_image'

    def __str__(self):
        return self.titulo or f"Imagem {self.id}"
