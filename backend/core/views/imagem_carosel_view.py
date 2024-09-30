# core/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from ..models import CarouselImage
from ..serializers import CarouselImageAdminSerializer
from rest_framework.generics import ListAPIView
from django.utils import timezone
from django.db.models import Q
from rest_framework.permissions import AllowAny
from ..serializers import CarouselImageClientSerializer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

class CarouselImageAdminViewSet(viewsets.ModelViewSet):
    queryset = CarouselImage.objects.all()
    serializer_class = CarouselImageAdminSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    #permission_classes = [IsAdminUser]

class CarouselImageListView(ListAPIView):
    queryset = CarouselImage.objects.all()
    serializer_class = CarouselImageClientSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        return CarouselImage.objects.filter(
            ativo=True
        ).filter(
            Q(data_inicio__lte=now) | Q(data_inicio__isnull=True),
            Q(data_fim__gte=now) | Q(data_fim__isnull=True),
        ).order_by('ordem')