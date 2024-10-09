from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def compress_image(image, max_width=1024, max_height=1024, quality=85):
    """
    Redimensiona a imagem para caber dentro do max_width x max_height e comprime a imagem.
    """
    img = Image.open(image)

    # Redimensiona a imagem mantendo a proporção
    img.thumbnail((max_width, max_height))

    # Salva a imagem comprimida em um objeto BytesIO
    output = BytesIO()
    img.save(output, format='JPEG', quality=quality)
    output.seek(0)

    # Converte a imagem comprimida para um InMemoryUploadedFile para salvar no modelo Django
    compressed_image = InMemoryUploadedFile(output, 'ImageField', 
                                            image.name, 'image/jpeg', 
                                            sys.getsizeof(output), None)
    return compressed_image
