from django.db import models

class Usuario(models.Model):
    ADMINISTRADOR = 'administrador'
    CLIENTE = 'cliente'
    TIPO_USUARIO_CHOICES = [
        (ADMINISTRADOR, 'Administrador'),
        (CLIENTE, 'Cliente'),
    ]

    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    tipo_usuario = models.CharField(max_length=50, choices=TIPO_USUARIO_CHOICES, default=CLIENTE)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.nome

class Categoria(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categoria'

    def __str__(self):
        return self.nome

class Produto(models.Model):
    ATIVO = 'Ativo'
    INATIVO = 'Inativo'
    STATUS_CHOICES = [
        (ATIVO, 'Ativo'),
        (INATIVO, 'Inativo'),
    ]

    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=ATIVO)
    data_adicionado = models.DateTimeField(auto_now_add=True)
    data_modificado = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'produto'

    def __str__(self):
        return self.nome

class ImagemProduto(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    url_imagem = models.TextField()
    descricao_imagem = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'imagem_produto'

    def __str__(self):
        return f"Imagem de {self.produto.nome}"

class Pedido(models.Model):
    PENDENTE = 'Pendente'
    PROCESSANDO = 'Processando'
    ENVIADO = 'Enviado'
    STATUS_CHOICES = [
        (PENDENTE, 'Pendente'),
        (PROCESSANDO, 'Processando'),
        (ENVIADO, 'Enviado'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    data_pedido = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'pedido'

    def __str__(self):
        return f"Pedido {self.id} - {self.usuario.nome}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'item_pedido'

    def __str__(self):
        return f"Item {self.produto.nome} do Pedido {self.pedido.id}"

class Endereco(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    endereco = models.TextField()
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    cep = models.CharField(max_length=20)
    pais = models.CharField(max_length=100)

    class Meta:
        db_table = 'endereco'

    def __str__(self):
        return f"Endereço de {self.usuario.nome}"

class Pagamento(models.Model):
    PAGO = 'Pago'
    PENDENTE = 'Pendente'
    STATUS_CHOICES = [
        (PAGO, 'Pago'),
        (PENDENTE, 'Pendente'),
    ]

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pagamento = models.CharField(max_length=50)
    status_pagamento = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
    data_pagamento = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pagamento'

    def __str__(self):
        return f"Pagamento do Pedido {self.pedido.id}"

class Avaliacao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nota = models.IntegerField()
    comentario = models.TextField(blank=True, null=True)
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'avaliacao'

    def __str__(self):
        return f"Avaliação de {self.usuario.nome} para {self.produto.nome}"

class Administrador(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'administrador'

    def __str__(self):
        return self.nome

class LogAcao(models.Model):
    admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)
    acao = models.TextField()
    data_acao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'log_acao'

    def __str__(self):
        return f"Ação de {self.admin.nome} em {self.data_acao}"

class Configuracao(models.Model):
    chave = models.CharField(max_length=255)
    valor = models.CharField(max_length=255)

    class Meta:
        db_table = 'configuracao'

    def __str__(self):
        return self.chave

class HistoricoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    status_antigo = models.CharField(max_length=50)
    status_novo = models.CharField(max_length=50)
    data_modificacao = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'historico_pedido'

    def __str__(self):
        return f"Histórico do Pedido {self.pedido.id}"
