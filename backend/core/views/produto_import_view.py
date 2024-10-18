from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
import pandas as pd
from ..models import Produto, Categoria, Marca
from ..serializers import ProdutoSerializerImport, ProdutoSerializer
from django.http import HttpResponse

class ProdutoImportView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "Nenhum arquivo enviado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Lê o arquivo XLSX enviado
            df = pd.read_excel(file)

            # Processa cada linha e cria os produtos
            for _, row in df.iterrows():
                produto_data = {
                    "nome": row['nome'],
                    "descricao": row.get('descricao', ''),  # Se não houver descrição, usar string vazia
                    "preco_custo": row.get('preco_custo', 0),
                    "preco_venda": row.get('preco_venda', 0),
                    "quantidade_estoque": row.get('quantidade_estoque', 0),
                    "status": row.get('status', 'Inativo'),
                    "teor_alcoolico": row.get('teor_alcoolico', None),
                    "volume": row.get('volume', None),
                    "altura": row.get('altura', None),
                    "largura": row.get('largura', None),
                    "comprimento": row.get('comprimento', None),
                    "peso": row.get('peso', None),
                }

                # Verifica e trata o campo 'categoria'
                categoria_nome = row.get('categoria', None)
                if categoria_nome:
                    try:
                        categoria = Categoria.objects.get(nome=categoria_nome)
                        produto_data['categoria'] = categoria.id  # Atribui o PK da categoria
                    except Categoria.DoesNotExist:
                        produto_data['categoria'] = None  # Deixa em branco se não existir

                # Verifica e trata o campo 'marca'
                marca_nome = row.get('marca', None)
                if marca_nome:
                    try:
                        marca = Marca.objects.get(nome=marca_nome)
                        produto_data['marca'] = marca.id  # Atribui o PK da marca
                    except Marca.DoesNotExist:
                        produto_data['marca'] = None  # Deixa em branco se não existir

                # Valida e cria o produto
                serializer = ProdutoSerializer(data=produto_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({"success": "Produtos importados com sucesso!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Rota para download do template XLSX
class ProdutoTemplateDownloadView(APIView):
    def get(self, request, *args, **kwargs):
        # Aqui você cria um DataFrame com as colunas necessárias
        df = pd.DataFrame(columns=[
            'nome', 'descricao', 'preco_custo', 'preco_venda', 'quantidade_estoque',
            'categoria', 'marca', 'status', 'teor_alcoolico', 'volume', 'altura', 'largura', 'comprimento', 'peso'
        ])
        
        # Salva o DataFrame como um arquivo XLSX
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="produtos_template.xlsx"'
        df.to_excel(response, index=False)
        
        return response
