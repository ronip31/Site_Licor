from django.db import models

class ThemeConfig(models.Model):
    primary_color = models.CharField(max_length=7, default='#232f3e')
    secondary_color = models.CharField(max_length=7, default='#ffffff')
    background_color = models.CharField(max_length=7, default='#f4f4f4')
    text_color = models.CharField(max_length=7, default='#000000')
    font_family = models.CharField(max_length=255, default='Roboto, Arial, sans-serif')

    # Novos campos para o header e footer
    header_background_color = models.CharField(max_length=7, default='#232f3e')
    footer_background_color = models.CharField(max_length=7, default='#232f3e')
    footer_text_color = models.CharField(max_length=7, default='#ffffff')

    # Novos campos para borda e espaçamento
    padding = models.CharField(max_length=20, default='10px')  # Para espaçamento/padding
    border_radius = models.CharField(max_length=20, default='4px')  # Para borda
    box_shadow = models.CharField(max_length=255, default='none')  # Para sombra da borda

    class Meta:
        db_table = 'theme_config'

    def __str__(self):
        return f"Configuração de Tema ID {self.id}"
