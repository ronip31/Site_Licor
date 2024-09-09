## Estrutura Completa do Banco de Dados
### Tabelas Principais
##### Tabela usuarios

- id_usuario (PK) – ID único do usuário.
- nome – Nome completo do usuário.
- email – Email do usuário (único).
- senha – Senha criptografada.
- telefone – Telefone do usuário.
- tipo_usuario – Indica se é um administrador ou um usuário comum (ex: "administrador", "cliente").
- data_criacao – Data de criação da conta.

##### Tabela produtos

- id_produto (PK) – ID único do produto.
- nome – Nome do produto.
- descricao – Descrição detalhada do produto.
- preco – Preço do produto.
- quantidade_estoque – Quantidade disponível no estoque.
- id_categoria (FK) – Referência à tabela de categorias.
- status – Status do produto (ex: "Ativo", "Inativo").
- data_adicionado – Data de adição do produto.
- data_modificado – Data da última modificação no produto.

##### Tabela imagens_produtos

- id_imagem (PK) – ID único da imagem.
- id_produto (FK) – Referência ao produto.
- url_imagem – URL da imagem armazenada.
- descricao_imagem – Descrição ou legenda da imagem (opcional).

##### Tabela categorias

- id_categoria (PK) – ID único da categoria.
- nome – Nome da categoria.
- descricao – Descrição da categoria.

##### Tabela pedidos

- id_pedido (PK) – ID único do pedido.
- id_usuario (FK) – Referência ao usuário que fez o pedido.
- data_pedido – Data de realização do pedido.
- status – Status do pedido (ex: "Pendente", "Processando", "Enviado").
- valor_total – Valor total do pedido.

##### Tabela itens_pedido

- id_item (PK) – ID único do item do pedido.
- id_pedido (FK) – Referência ao pedido.
- id_produto (FK) – Referência ao produto.
- quantidade – Quantidade do produto no pedido.
- preco_unitario – Preço unitário do produto no momento do pedido.

##### Tabela enderecos

- id_endereco (PK) – ID único do endereço.
- id_usuario (FK) – Referência ao usuário.
- endereco – Endereço completo.
- cidade – Cidade.
- estado – Estado.
- cep – Código postal.
- pais – País.

##### Tabela pagamentos

- id_pagamento (PK) – ID único do pagamento.
- id_pedido (FK) – Referência ao pedido.
- metodo_pagamento – Método de pagamento (ex: "Cartão de Crédito", "Boleto").
- status_pagamento – Status do pagamento (ex: "Pago", "Pendente").
- data_pagamento – Data de processamento do pagamento.

##### Tabela avaliacoes

- id_avaliacao (PK) – ID único da avaliação.
- id_produto (FK) – Referência ao produto.
- id_usuario (FK) – Referência ao usuário que fez a avaliação.
- nota – Nota da avaliação (ex: 1 a 5).
- comentario – Comentário adicional do usuário.
- data_avaliacao – Data em que a avaliação foi feita.

##### Tabela administradores

- id_admin (PK) – ID único do administrador.
- nome – Nome completo do administrador.
- email – Email do administrador (único).
- senha – Senha criptografada.
- data_criacao – Data de criação da conta.

##### Tabela log_acoes

- id_log (PK) – ID único do log.
- id_admin (FK) – Referência ao administrador que realizou a ação.
- acao – Descrição da ação realizada (ex: "Adicionou Produto", "Excluiu Categoria").
- data_acao – Data e hora em que a ação foi realizada.

##### Tabela configuracoes

- id_configuracao (PK) – ID único da configuração.
- chave – Chave de configuração (ex: "método_pagamento", "envio_gratuito_acima").
- valor – Valor da configuração (ex: "Cartão de Crédito", "100").

##### Tabela historico_pedidos

- id_historico (PK) – ID único do histórico.
- id_pedido (FK) – Referência ao pedido.
- status_antigo – Status anterior do pedido.
- status_novo – Novo status do pedido.
- data_modificacao – Data da modificação do status.
- id_admin (FK) – Referência ao administrador que realizou a alteração (pode ser nulo se feito pelo usuário).

### Relacionamentos
- Um **usuario** pode ter múltiplos **pedidos**.
- Um **pedido** pode conter múltiplos **itens_pedido**.
- Um **produto** pode pertencer a uma **categoria**.
- Um **usuario** pode ter múltiplos **enderecos**.
- Um **produto** pode ter múltiplas **avaliacoes**.
- Um **produto** pode ter múltiplas **imagens_produtos**.
- Cada **imagem_produtos** está associada a um **único produto**.
- Um **administrador** pode gerenciar múltiplos registros (produtos, categorias, pedidos).
- A tabela **log_acoes** rastreia as ações realizadas por cada **administrador**.
- A tabela **historico_pedidos** armazena as alterações de status dos pedidos, rastreando quem realizou a alteração e quando.
