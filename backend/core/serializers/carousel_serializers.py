from rest_framework import serializers
from ..models import CarouselImage

class CarouselImageAdminSerializer(serializers.ModelSerializer):
    imagem = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CarouselImage
        fields = '__all__'

    def update(self, instance, validated_data):
        imagem = validated_data.get('imagem', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if 'imagem' in validated_data:
            if imagem is None and instance.imagem:
                instance.imagem.delete(save=False)
                instance.imagem = None
            elif imagem:
                instance.imagem = imagem
        instance.save()
        return instance

class CarouselImageClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselImage
        fields = ['uuid', 'titulo', 'imagem', 'link_url']
