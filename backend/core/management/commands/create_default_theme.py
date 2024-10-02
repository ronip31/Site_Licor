# yourapp/management/commands/create_default_theme.py
from django.core.management.base import BaseCommand
from core.models import ThemeConfig

class Command(BaseCommand):
    help = 'Cria um tema padrão no banco de dados'

    def handle(self, *args, **kwargs):
        if not ThemeConfig.objects.exists():
            ThemeConfig.objects.create(
                primary_color='#232f3e',
                secondary_color='#ffffff',
                background_color='#f4f4f4',
                text_color='#000000',
                font_family='Roboto, Arial, sans-serif'
            )
            self.stdout.write(self.style.SUCCESS('Tema padrão criado com sucesso.'))
        else:
            self.stdout.write(self.style.WARNING('Tema já existente, nenhuma ação foi realizada.'))
