from rest_framework import serializers
from ..models import ThemeConfig

class ThemeConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeConfig
        fields = '__all__'
