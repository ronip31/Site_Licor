# core/views/configuracao_frete_view.py
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import OpcaoFrete, ConfiguracaoFrete
from ..serializers import OpcaoFreteSerializer, ConfiguracaoFreteSerializer
from ..permissions import IsAdminUser

class OpcaoFreteListView(viewsets.ModelViewSet):
    queryset = OpcaoFrete.objects.all()
    serializer_class = OpcaoFreteSerializer
    permission_classes = [IsAdminUser]

class ConfiguracaoFreteView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        try:
            config = ConfiguracaoFrete.objects.first()
            serializer = ConfiguracaoFreteSerializer(config)
            return Response(serializer.data)
        except ConfiguracaoFrete.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        config_data = request.data.get('config')
        options_data = request.data.get('shippingOptions')

        # Validação e atualização da configuração de frete
        serializer = ConfiguracaoFreteSerializer(data=config_data)
        if serializer.is_valid():
            config, created = ConfiguracaoFrete.objects.update_or_create(
                defaults=serializer.validated_data,
                id=1  # Ou alguma lógica para identificar a configuração existente
            )

            # Atualiza as opções de frete
            if options_data:
                for option_data in options_data:
                    OpcaoFrete.objects.filter(id_frete=option_data['id_frete']).update(ativo=option_data['ativo'])

            return Response({"success": "Configurações salvas com sucesso!"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)