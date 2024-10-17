from decimal import Decimal
from django.utils import timezone
import requests
from ..models import Produto, ConfiguracaoFrete, OpcaoFrete, Categoria,Carrinho

class CupomService:

    @staticmethod
    def aplicar_cupom(cupom, usuario, produtos_detalhes):
        """
        Aplica o cupom de desconto considerando todas as regras de combinação de promoções e restrições de produtos/categorias.
        """

        # Transformar UUIDs de produtos em objetos de produto
        produtos_uuids = [produto['uuid'] for produto in produtos_detalhes]
        produtos = Produto.objects.filter(uuid__in=produtos_uuids).select_related('categoria')  # Inclui categoria relacionada

        # Verificar se o cupom é aplicável a produtos específicos
        if cupom.produtos.exists() and not any(produto.uuid in cupom.produtos.values_list('uuid', flat=True) for produto in produtos):
            raise ValueError("Este cupom não é aplicável aos produtos selecionados.")

        # Verificar se o cupom é aplicável a categorias específicas
        categorias_ids = {
            produto['categoria_id'] if 'categoria_id' in produto else produto_obj.categoria.id
            for produto, produto_obj in zip(produtos_detalhes, produtos)
        }
        print(f"Categorias IDs dos produtos: {categorias_ids}")

        # Filtrar categorias permitidas pelo cupom
        categorias_cupom = set(cupom.categorias.values_list('id', flat=True))
        print(f"Categorias do cupom: {categorias_cupom}")

        # Filtrar produtos que pertencem às categorias do cupom
        produtos_validos_categoria = [
            produto for produto, produto_obj in zip(produtos_detalhes, produtos)
            if not cupom.categorias.exists() or produto_obj.categoria.id in categorias_cupom
        ]

        if not produtos_validos_categoria:
            raise ValueError("Nenhum dos produtos selecionados pertence às categorias aplicáveis a este cupom.")

        # Verificar se o cupom está ativo
        if not cupom.is_active():
            raise ValueError("Este cupom está expirado ou inativo.")

        # Verificar se o cupom é aplicável ao usuário logado
        if cupom.clientes_exclusivos.exists():
            if not usuario or not usuario.is_authenticated:
                raise ValueError("Você precisa estar logado para aplicar este cupom.")
            if usuario.uuid not in cupom.clientes_exclusivos.values_list('uuid', flat=True):
                raise ValueError("Este cupom não é aplicável ao seu usuário.")

        # Itera sobre os produtos válidos e determina o valor aplicável ao cupom
        valor_total_aplicavel = Decimal(0)
        valor_promocional = Decimal(0)  # Para somar o valor dos produtos em promoção

        for produto in produtos_validos_categoria:
            promocao = produto['preco'] < produto['preco_venda']  # Verifica se o produto está em promoção

            if promocao:
                if not cupom.permitir_combinacao_com_promocoes:
                    # Ignora o produto com promoção se o cupom não permite a combinação
                    valor_promocional += Decimal(produto['preco']) * produto['quantidade']
                else:
                    # Aplica o desconto sobre o valor promocional
                    valor_total_aplicavel += Decimal(produto['preco']) * produto['quantidade']
            else:
                # Produto sem promoção, aplica o desconto
                valor_total_aplicavel += Decimal(produto['preco_venda']) * produto['quantidade']

        # Se não há valor aplicável e a combinação com promoções não é permitida, não permite o cupom
        if valor_total_aplicavel == 0 and not cupom.permitir_combinacao_com_promocoes:
            raise ValueError("Cupom não pode ser aplicado aos produtos selecionados!")

        # Verificar se o valor da compra atende ao valor mínimo do cupom (agora após aplicar as outras regras)
        if cupom.valor_minimo_compra and valor_total_aplicavel < cupom.valor_minimo_compra:
            raise ValueError(f"O valor mínimo de compra para usar este cupom é R$ {cupom.valor_minimo_compra}.")

        # Aplicar o desconto apenas no valor aplicável (produtos não promocionados ou promocionados, se permitido)
        desconto_info = CupomService.calcular_desconto(cupom, valor_total_aplicavel)

        return desconto_info




    @staticmethod
    def calcular_desconto(cupom, valor_total_aplicavel):
        """
        Função para calcular o desconto baseado no tipo de cupom e retornar se o frete é grátis.
        """
        desconto = Decimal(0)
        frete_gratis = False
        mensagem = None

        if cupom.tipo == 'percentual':
            desconto = valor_total_aplicavel * (cupom.valor / Decimal(100))
            if cupom.valor_maximo_desconto:
                desconto = min(desconto, cupom.valor_maximo_desconto)
            mensagem = f"Desconto de {cupom.valor}% aplicado com sucesso."

        elif cupom.tipo == 'valor':
            desconto = cupom.valor
            mensagem = f"Desconto de R$ {cupom.valor} aplicado com sucesso."

        elif cupom.tipo == 'frete_gratis':
            frete_gratis = True
            mensagem = "Frete grátis aplicado com sucesso."

        return {
            "desconto": desconto,
            "frete_gratis": frete_gratis,
            "mensagem": mensagem,
        }


    @staticmethod
    def calcular_frete(produto_uuid, cep_destino, token):
        try:
            produto = Produto.objects.get(uuid=produto_uuid)
            configuracao_frete = ConfiguracaoFrete.objects.first()

            url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate"

            payload = {
                "from": {"postal_code": str(configuracao_frete.cep_origem)},
                "to": {"postal_code": str(cep_destino)},
                "package": {
                    "height": str(produto.altura),
                    "width": str(produto.largura),
                    "length": str(produto.comprimento),
                    "weight": str(produto.peso),
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

                opcoes_frete_ativas = OpcaoFrete.objects.filter(ativo=True).values_list('id_frete', flat=True)

                opcoes_filtradas = [
                    opcao for opcao in resultado_frete if int(opcao['id']) in opcoes_frete_ativas
                ]

                # Aplicar descontos/acréscimos e criar a resposta simplificada
                resultado_final = []
                for opcao in opcoes_filtradas:
                    preco_original = float(opcao.get('custom_price', opcao.get('price', 0)))

                    desconto_frete = float(configuracao_frete.desconto_frete or 0)
                    acrescimo_frete = float(configuracao_frete.acrescimo_frete or 0)
                    dias_adicionais_entrega = int(configuracao_frete.dias_adicionais_entrega or 0)

                    desconto = preco_original * (desconto_frete / 100)
                    acrescimo = preco_original * (acrescimo_frete / 100)
                    preco_final = preco_original - desconto + acrescimo

                    tempo_entrega_dias = opcao.get('delivery_time', 0) + dias_adicionais_entrega

                    # Adicionar apenas as informações necessárias ao resultado, removendo opções com preco_final = 0
                    if preco_final > 0:
                        resultado_final.append({
                            'nome': opcao.get('name'),
                            'preco_final': round(preco_final, 2),
                            'tempo_entrega_dias': tempo_entrega_dias
                        })

                return resultado_final
            else:
                return {"error": response.text}

        except Produto.DoesNotExist:
            return {"error": "Produto não encontrado."}
        except Exception as e:
            return {"error": str(e)}
