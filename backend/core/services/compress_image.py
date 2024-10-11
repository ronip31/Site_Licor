from PIL import Image 
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def compress_image(image, max_width=1024, max_height=1024, quality=85):
    """
    Redimensiona a imagem para caber dentro do max_width x max_height e comprime a imagem.
    Mantém a melhor qualidade possível para os formatos JPEG e PNG.
    """
    img = Image.open(image)

    # Redimensiona a imagem mantendo a proporção
    img.thumbnail((max_width, max_height))

    output = BytesIO()

    # Verifica o formato da imagem e ajusta conforme necessário
    if img.mode in ("RGBA", "P"):  # Se houver transparência, usa PNG
        img.save(output, format='PNG', optimize=True)  # PNG não usa 'quality', então usamos 'optimize'
        image_format = 'image/png'
    else:
        img = img.convert('RGB')  # Converte para RGB se necessário (JPEG não suporta transparência)
        img.save(output, format='JPEG', quality=quality, optimize=True)  # JPEG usa 'quality' e 'optimize'
        image_format = 'image/jpeg'

    output.seek(0)

    # Converte a imagem comprimida para um InMemoryUploadedFile para salvar no modelo Django
    compressed_image = InMemoryUploadedFile(output, 'ImageField', 
                                            image.name, image_format, 
                                            sys.getsizeof(output), None)
    return compressed_image
