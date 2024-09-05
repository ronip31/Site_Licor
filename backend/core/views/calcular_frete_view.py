from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services import calcular_frete
from ..serializers import CalculoFreteSerializer
from decouple import config

SECRET_KEY = config('TOKEN_API_CORREIO')

class CalcularFreteView(APIView):
    def post(self, request):
        serializer = CalculoFreteSerializer(data=request.data)
        if serializer.is_valid():
            produto_id = serializer.validated_data['produto_id']
            cep_destino = serializer.validated_data['cep_destino']

            resultado_frete = calcular_frete(produto_id, cep_destino, SECRET_KEY)

            if "error" in resultado_frete:
                return Response({"error": resultado_frete["error"]}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(resultado_frete, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
