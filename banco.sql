-- Tabela usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('administrador', 'cliente')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela categorias
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT
);

-- Tabela produtos
CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade_estoque INT NOT NULL,
    id_categoria INT REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Ativo', 'Inativo')),
    data_adicionado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_modificado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela imagens_produtos
CREATE TABLE imagens_produtos (
    id_imagem SERIAL PRIMARY KEY,
    id_produto INT REFERENCES produtos(id_produto) ON DELETE CASCADE,
    url_imagem TEXT NOT NULL,
    descricao_imagem TEXT
);

-- Tabela pedidos
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pendente', 'Processando', 'Enviado')),
    valor_total DECIMAL(10, 2) NOT NULL
);

-- Tabela itens_pedido
CREATE TABLE itens_pedido (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_produto INT REFERENCES produtos(id_produto) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL
);

-- Tabela enderecos
CREATE TABLE enderecos (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    pais VARCHAR(100) NOT NULL
);

-- Tabela pagamentos
CREATE TABLE pagamentos (
    id_pagamento SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    metodo_pagamento VARCHAR(50) NOT NULL,
    status_pagamento VARCHAR(50) NOT NULL CHECK (status_pagamento IN ('Pago', 'Pendente')),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela avaliacoes
CREATE TABLE avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    id_produto INT REFERENCES produtos(id_produto) ON DELETE CASCADE,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nota INT CHECK (nota >= 1 AND nota <= 5) NOT NULL,
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela administradores
CREATE TABLE administradores (
    id_admin SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela log_acoes
CREATE TABLE log_acoes (
    id_log SERIAL PRIMARY KEY,
    id_admin INT REFERENCES administradores(id_admin) ON DELETE SET NULL,
    acao TEXT NOT NULL,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela configuracoes
CREATE TABLE configuracoes (
    id_configuracao SERIAL PRIMARY KEY,
    chave VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL
);

-- Tabela historico_pedidos
CREATE TABLE historico_pedidos (
    id_historico SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    status_antigo VARCHAR(50) NOT NULL CHECK (status_antigo IN ('Pendente', 'Processando', 'Enviado')),
    status_novo VARCHAR(50) NOT NULL CHECK (status_novo IN ('Pendente', 'Processando', 'Enviado')),
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_admin INT REFERENCES administradores(id_admin) ON DELETE SET NULL
);
