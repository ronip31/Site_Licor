from decimal import Decimal
from django.utils import timezone
import requests
from ..models import Produto, ConfiguracaoFrete, OpcaoFrete, Categoria

class CupomService:

    @staticmethod
    def aplicar_cupom(cupom, valor_compra, usuario, produtos_uuids, categorias_ids):
        # Verifica se o usuário está logado
        if not usuario or not usuario.is_authenticated:
            raise ValueError("Você precisa estar logado para aplicar este cupom.")

        # Transformar UUIDs de produtos em objetos de produto
        produtos = Produto.objects.filter(uuid__in=produtos_uuids)
        
        # Transformar IDs de categorias em objetos de categoria
        categorias = Categoria.objects.filter(id__in=categorias_ids)

        # Verificar se o cupom é aplicável a produtos específicos
        if cupom.produtos.exists() and not any(produto.uuid in cupom.produtos.values_list('uuid', flat=True) for produto in produtos):
            raise ValueError("Este cupom não é aplicável aos produtos selecionados.")

        # Verificar se o cupom é aplicável a categorias específicas
        if cupom.categorias.exists() and not any(categoria.id in cupom.categorias.values_list('id', flat=True) for categoria in categorias):
            raise ValueError("Este cupom não é aplicável às categorias selecionadas.")

        # Verificar se o cupom está ativo
        if not cupom.is_active():
            raise ValueError("Este cupom está expirado ou inativo.")

        # Verificar se o valor da compra atende ao valor mínimo do cupom
        valor_compra = Decimal(valor_compra)
        if cupom.valor_minimo_compra and valor_compra < cupom.valor_minimo_compra:
            raise ValueError(f"O valor mínimo de compra para usar este cupom é R$ {cupom.valor_minimo_compra}.")

        # Verificar se o cupom é aplicável ao usuário logado
        if cupom.clientes_exclusivos.exists() and usuario.uuid not in cupom.clientes_exclusivos.values_list('uuid', flat=True):
            raise ValueError("Este cupom não é aplicável ao seu usuário.")

        # Aplicar o desconto e verificar se o frete é grátis
        resultado = CupomService.calcular_desconto(cupom, valor_compra)

        return resultado

    @staticmethod
    def calcular_desconto(cupom, valor_compra):
        """
        Função para calcular o desconto baseado no tipo de cupom e retornar se o frete é grátis.
        """
        desconto = Decimal(0)
        frete_gratis = False
        mensagem = None

        if cupom.tipo == 'percentual':
            # Cálculo de desconto percentual
            desconto = valor_compra * (cupom.valor / Decimal(100))
            if cupom.valor_maximo_desconto:
                desconto = min(desconto, cupom.valor_maximo_desconto)
            mensagem = f"Desconto de {cupom.valor}% aplicado com sucesso."

        elif cupom.tipo == 'valor':
            # Cálculo de desconto de valor fixo
            desconto = cupom.valor
            mensagem = f"Desconto de R$ {cupom.valor} aplicado com sucesso."

        elif cupom.tipo == 'frete_gratis':
            # No caso de frete grátis, não aplica desconto no valor da compra, mas sinaliza frete grátis
            frete_gratis = True
            mensagem = "Frete grátis aplicado com sucesso."

        # Retorna um dicionário com as informações
        return {
            "desconto": desconto,
            "frete_gratis": frete_gratis,
            "mensagem": mensagem
        }
    

    @staticmethod
    def calcular_frete(produto_id, cep_destino, token):
        try:
            produto = Produto.objects.get(uuid=produto_id)
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
