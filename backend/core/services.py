import requests
from .models import Produto, ConfiguracaoFrete, OpcaoFrete

def calcular_frete(produto_id, cep_destino, token):
    try:
        produto = Produto.objects.get(id=produto_id)
        configuracao_frete = ConfiguracaoFrete.objects.first()  # Assume que há apenas uma configuração de frete

        url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate"

        payload = {
            "from": {"postal_code": str(configuracao_frete.cep_origem)},  # Convertendo para string
            "to": {"postal_code": str(cep_destino)},  # Convertendo para string
            "package": {
                "height": str(produto.altura),   # Convertendo para float
                "width": str(produto.largura),   # Convertendo para float
                "length": str(produto.comprimento),   # Convertendo para float
                "weight": str(produto.peso),   # Convertendo para float
            },
        }

        headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
                "User-Agent": "Aplicação roni.pereira31@gmail.com"
            }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 200:
            resultado_frete = response.json()

            opcoes_frete_ativas = OpcaoFrete.objects.filter(ativo=True).values_list('id_frete', flat=True)  # IDs das opções de frete ativas

            # Filtra as opções de frete com base nas opções ativas configuradas pelo administrador
            opcoes_filtradas = [
                opcao for opcao in resultado_frete if int(opcao['id']) in opcoes_frete_ativas
            ]

            # Aplica descontos ou acréscimos configurados
            for opcao in opcoes_filtradas:
                preco_original = float(opcao['price'])  # Certifica-se de converter para float

                # Verifica se os valores de desconto e acréscimo são válidos, senão define como 0
                desconto_frete = float(configuracao_frete.desconto_frete) if configuracao_frete.desconto_frete is not None else 0.0
                acrescimo_frete = float(configuracao_frete.acrescimo_frete) if configuracao_frete.acrescimo_frete is not None else 0.0
                dias_adicionais_entrega = int(configuracao_frete.dias_adicionais_entrega) if configuracao_frete.dias_adicionais_entrega is not None else 0

                desconto = preco_original * (desconto_frete / 100)
                acrescimo = preco_original * (acrescimo_frete / 100)
                preco_final = preco_original - desconto + acrescimo
                tempo_entrega_dias = opcao['delivery_time'] + dias_adicionais_entrega

                # Atualiza os dados diretamente no resultado
                opcao['preco_final'] = round(preco_final, 2)
                opcao['tempo_entrega_dias'] = tempo_entrega_dias

            return opcoes_filtradas
        else:
            return {"error": response.text}

    except Produto.DoesNotExist:
        return {"error": "Produto não encontrado."}
    except Exception as e:
        return {"error": str(e)}
