from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services import CupomService
from ..serializers import CalculoFreteSerializer
from decouple import config
from ..models import Produto
from rest_framework.permissions import IsAdminUser

SECRET_KEY = config('TOKEN_API_CORREIO')

class CalcularFreteView(APIView):
    # permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = CalculoFreteSerializer(data=request.data)
        if serializer.is_valid():
            produto_uuid = serializer.validated_data['produto_uuid']
            cep_destino = serializer.validated_data['cep_destino']

            try:
                produto = Produto.objects.get(uuid=produto_uuid)
            except Produto.DoesNotExist:
                return Response({"error": "Produto não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            # Calcular frete
            resultado_frete = CupomService.calcular_frete(produto.uuid, cep_destino, SECRET_KEY)
            
            if "error" in resultado_frete:
                return Response({"error": resultado_frete["error"]}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(resultado_frete, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

