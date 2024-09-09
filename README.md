## **Arquitetura Completa das Telas do Site**
Este documento descreve a arquitetura das telas do projeto, dividindo-se em duas seções principais: Telas do Usuário Final e Telas de Administração. Cada tela está detalhada com seus respectivos componentes e funcionalidades.

### 1. Telas Do Usuário Final
#### Home Page
A Home Page é a porta de entrada para o usuário, com foco em promoções e produtos em destaque.

- ##### Componentes:
	- Banner principal com promoções.
	- Barra de pesquisa.
	- Categorias de produtos.
	- Produtos em destaque.
	- Seção de ofertas especiais.
	- Rodapé com informações de contato, links para redes sociais, termos de uso, etc.

### Página de Listagem de Produtos

Tela onde os usuários podem navegar e filtrar produtos.

- ##### Componentes:
	- Filtros de busca (por preço, categoria, avaliações).
	- Ordenação (por preço, popularidade, novidade).
	- Exibição dos produtos em grid ou lista, mostrando imagem, nome, preço e botão "Adicionar ao Carrinho".

### Página de Detalhes do Produto

Tela detalhada para cada produto, incentivando a conversão.

- ##### Componentes:
	- Imagem do produto (com zoom).
	- Nome do produto.
	- Preço.
	- Descrição detalhada.
	- Avaliações dos clientes.
	- Botões de "Adicionar ao Carrinho" e "Comprar Agora".``
	- Produtos relacionados.

### Carrinho de Compras
Visão geral dos produtos adicionados ao carrinho antes da finalização da compra.

- ##### Componentes:
	- Lista de produtos (imagem, nome, preço, quantidade).
	- Opção para alterar quantidade ou remover produtos.
	- Resumo do pedido (sub-total, frete, total).
	- Botão "Finalizar Compra".

### Página de Checkout
Tela para inserção das informações necessárias para finalizar a compra.

- ##### Componentes:
	- Formulário de informações de envio (nome, endereço, telefone).
	- Escolha do método de pagamento (cartão de crédito, boleto, etc.).
	- Resumo do pedido.
	- Botão "Confirmar Pedido".

### Página de Confirmação de Pedido
Confirmação da compra realizada com detalhes e status.

- ##### Componentes:
	- Resumo do pedido.
	- Informações de envio.
	- Status do pedido.
	- Link para "Continuar Comprando".

### Página de Login/Cadastro
Tela de autenticação e criação de conta.

- ##### Componentes:
	- Formulário de login (e-mail, senha).
	- Link para recuperação de senha.
	- Formulário de cadastro (nome, e-mail, senha, telefone).
	- Botão de login/cadastro com redes sociais.

### Painel do Usuário
Área reservada para gerenciamento das informações pessoais e pedidos.

- ##### Componentes:
	- Visão geral (informações de conta, histórico de pedidos).
	- Seção de endereços.
	- Seção de métodos de pagamento.
	- Seção de preferências de notificações.
	- Botão de logout.


## 2. Telas de Administração

### Tela de Login do Administrador
Tela de autenticação para o painel de administração.

- ##### Componentes:
	- Formulário de login (e-mail e senha).
	- Botão "Entrar".
	- Link para recuperação de senha.

### Dashboard
Visão geral do sistema com estatísticas e atalhos.

- ##### Componentes:
	- Gráficos e estatísticas (vendas do dia, produtos em estoque, pedidos pendentes).
	- Atalhos para as principais funcionalidades (gerenciamento de produtos, pedidos, categorias, usuários).

### Gerenciamento de Produtos
Controle completo dos produtos cadastrados na plataforma.

- ##### Componentes:
	- Listagem de produtos com opções de edição, exclusão e visualização.
	- Filtros de busca (nome, categoria, preço, etc.).
	- Botão "Adicionar Produto" com acesso ao formulário de cadastro.
	- Formulário de edição com campos para nome, descrição, preço, categoria, quantidade em estoque, upload de imagem.

### Tela de Cadastro de Produto
Formulário para criação ou edição de produtos.

- ##### Componentes:
	- Campos de Entrada:
	- Nome do Produto.
	- Descrição do Produto.
	- Preço de custo.
	- Precço de venda
	- Quantidade em Estoque.
	- Categoria (dropdown para selecionar a categoria existente).
	- Upload de Imagens (permitir upload de uma ou mais imagens do produto).
	- Status do Produto (ex: Ativo, Inativo).
	- Teor Alcoolico
	- Volume
	- Marca
	- e propriedades para calculo de entrega: Altura, Largura, Comprimento, Peso.


- ##### Botões:
	- Salvar (confirmação do cadastro ou edição do produto).
	- Cancelar (volta à lista de produtos sem salvar).

- ##### Validações:
	- Verificação de campos obrigatórios (nome, preço, categoria, etc.).
	- Upload de imagem no formato correto e com tamanho adequado.

### Gerenciamento de Categorias / Grupos / Marcas
Gerenciamento das categorias , protudos e marcas de produtos na plataforma.

- ##### Componentes:
	- Listagem de categorias , protudos e marcas com opções de edição, exclusão e visualização.
	- Botão "Adicionar Categoria" com acesso ao formulário de cadastro.
	- Formulário de edição com campos para nome e descrição.

### Gerenciamento de Descontos
Gerenciamento de descontos dos Produtos.

- ##### Componentes:
	- Tela para gerenciar possíveis descontos por produtos, categorias, e clientes.

### Gerenciamento de Frete
Gerenciamento de calculo de entregas.

- ##### Componentes:
	- Possibilidade de gerenciar Origem da entregas, descontos de entrega, dias adicionais.
	- Habilitar opções de entrega, Sedex ou Pac.

### Gerenciamento de Pedidos
Controle completo dos pedidos realizados pelos usuários.

- ##### Componentes:
	- Listagem de pedidos (ID do pedido, usuário, data, status e valor total).
	- Filtros de busca (status, data, usuário, etc.).
	- Opções para alterar o status do pedido.
	- Visualização detalhada do pedido (itens, informações de pagamento e envio).

### Gerenciamento de Usuários
Gerenciamento de usuários registrados na plataforma.

- ##### Componentes:
	- Listagem de usuários com opções de edição e exclusão.
	- Filtros de busca (nome, e-mail, data de cadastro, etc.).
	- Botão "Adicionar Usuário" para criar novos usuários.
	- Formulário de edição com campos para nome, e-mail, senha, e tipo de usuário (administrador ou cliente).

### Configurações de Sistema
Opções avançadas de configuração da plataforma.

- ##### Componentes:
	- Configuração de métodos de pagamento, envio, integração com APIs, etc.
	- Gerenciamento de permissões de usuários e definições de acessos.
