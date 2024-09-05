# from django.db import models
# from django.contrib.auth.hashers import check_password
# from django.contrib.auth.hashers import make_password
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.utils import timezone

# class UsuarioManager(BaseUserManager):
#     def create_user(self, email, nome, password=None, **extra_fields):
#         if not email:
#             raise ValueError('O email deve ser fornecido')
#         email = self.normalize_email(email)
#         user = self.model(email=email, nome=nome, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, nome, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)

#         return self.create_user(email, nome, password, **extra_fields)

# class Usuario(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     nome = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)
#     telefone = models.CharField(max_length=20, blank=True, null=True)
#     tipo_usuario = models.CharField(max_length=50, choices=[('administrador', 'Administrador'), ('cliente', 'Cliente')], default='cliente')
#     data_criacao = models.DateTimeField(auto_now_add=True)
#     is_active = models.BooleanField(default=True)  # Necessário para is_authenticated
#     is_staff = models.BooleanField(default=False)  # Necessário para acesso ao admin site

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['nome']

#     objects = UsuarioManager()

#     class Meta:
#         db_table = 'usuario'

#     def __str__(self):
#         return self.email
    
#     def get_desconto_aplicavel(self):
#         """
#         Retorna o desconto aplicável ao cliente específico.
#         """
#         descontos_cliente = self.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())
#         if descontos_cliente.exists():
#             return descontos_cliente.first()  # Retorna o primeiro desconto válido encontrado para o cliente
#         return None  # Nenhum desconto aplicável
    
    

# class Categoria(models.Model):
#     nome = models.CharField(max_length=255)
#     descricao = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'categoria'

#     def __str__(self):
#         return self.nome
    



# class TipoLicor(models.Model):
#     nome = models.CharField(max_length=255)
#     descricao = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'tipo_licor'

#     def __str__(self):
#         return self.nome
    
# class Produto(models.Model):
#     ATIVO = 'Ativo'
#     INATIVO = 'Inativo'
#     STATUS_CHOICES = [
#         (ATIVO, 'Ativo'),
#         (INATIVO, 'Inativo'),
#     ]

#     nome = models.CharField(max_length=255)
#     descricao = models.TextField()
#     preco_custo = models.DecimalField(max_digits=10, decimal_places=2)
#     preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
#     quantidade_estoque = models.IntegerField()
#     categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
#     sku = models.CharField(max_length=101, unique=True)
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=ATIVO)
#     teor_alcoolico = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
#     volume = models.CharField(max_length=50, null=True, blank=True)
#     marca = models.ForeignKey(Marca, on_delete=models.SET_NULL, null=True, blank=True)
#     tipo_licor = models.ForeignKey(TipoLicor, on_delete=models.SET_NULL, null=True, blank=True)
#     data_adicionado = models.DateTimeField(auto_now_add=True)
#     data_modificado = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'produto'

#     def __str__(self):
#         return self.nome
#     def get_desconto_aplicavel(self):
#         """
#         Retorna o desconto aplicável para o produto, considerando
#         descontos específicos do produto, categoria e tipo de licor.
#         """
#         descontos_produto = self.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())
#         descontos_categoria = self.categoria.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())
#         descontos_tipo = self.tipo_licor.descontos.filter(data_inicio__lte=timezone.now(), data_fim__gte=timezone.now())

#         # Prioridade de desconto: Produto > Categoria > Tipo de Licor
#         if descontos_produto.exists():
#             return descontos_produto.first()  # Retorna o primeiro desconto válido encontrado para o produto
#         elif descontos_categoria.exists():
#             return descontos_categoria.first()  # Retorna o primeiro desconto válido encontrado para a categoria
#         elif descontos_tipo.exists():
#             return descontos_tipo.first()  # Retorna o primeiro desconto válido encontrado para o tipo de licor
#         return None  # Nenhum desconto aplicável

# class Desconto(models.Model):
#     # Campos comuns a todos os tipos de desconto
#     percentual = models.DecimalField(max_digits=5, decimal_places=2)
#     data_inicio = models.DateTimeField()
#     data_fim = models.DateTimeField()
#     descricao = models.TextField(blank=True, null=True)

#     # Relacionamentos para aplicar descontos específicos
#     produto = models.ForeignKey(
#         Produto, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True
#     )
#     categoria = models.ForeignKey(
#         Categoria, on_delete=models.CASCADE, related_name='descontos', null=True, blank=True
#     )
#     tipo_licor = models.ForeignKey(
#         'TipoLicor', on_delete=models.CASCADE, related_name='descontos', null=True, blank=True
#     )
#     cliente = models.ForeignKey(
#         'Cliente', on_delete=models.CASCADE, related_name='descontos', null=True, blank=True
#     )

#     class Meta:
#         db_table = 'desconto'

#     def __str__(self):
#         return f"Desconto de {self.percentual}%"

#     def get_aplicacao(self):
#         """
#         Retorna uma descrição mais detalhada sobre a aplicação do desconto.
#         """
#         aplicacoes = []
#         if self.produto:
#             aplicacoes.append(f"Produto: {self.produto.nome}")
#         if self.categoria:
#             aplicacoes.append(f"Categoria: {self.categoria.nome}")
#         if self.tipo_licor:
#             aplicacoes.append(f"Tipo de Licor: {self.tipo_licor.nome}")
#         if self.cliente:
#             aplicacoes.append(f"Cliente: {self.cliente.nome}")

#         if aplicacoes:
#             return ", ".join(aplicacoes)
#         return "Desconto geral"

#     def is_active(self):
#         """
#         Verifica se o desconto está ativo com base na data atual.
#         """
#         now = timezone.now()
#         return self.data_inicio <= now <= self.data_fim



# class ImagemProduto(models.Model):
#     produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='imagens')
#     imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)  # Certifique-se que o campo está correto
#     descricao_imagem = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'imagem_produto'

#     def __str__(self):
#         return f"Imagem de {self.produto.nome}"
    
# class Pedido(models.Model):
#     PENDENTE = 'Pendente'
#     PROCESSANDO = 'Processando'
#     ENVIADO = 'Enviado'
#     STATUS_CHOICES = [
#         (PENDENTE, 'Pendente'),
#         (PROCESSANDO, 'Processando'),
#         (ENVIADO, 'Enviado'),
#     ]

#     usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
#     data_pedido = models.DateTimeField(auto_now_add=True)
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
#     valor_total = models.DecimalField(max_digits=10, decimal_places=2)

#     class Meta:
#         db_table = 'pedido'

#     def __str__(self):
#         return f"Pedido {self.id} - {self.usuario.nome}"

# class ItemPedido(models.Model):
#     pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
#     produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
#     quantidade = models.IntegerField()
#     preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

#     class Meta:
#         db_table = 'item_pedido'

#     def __str__(self):
#         return f"Item {self.produto.nome} do Pedido {self.pedido.id}"

# class Endereco(models.Model):
#     usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
#     endereco = models.TextField()
#     cidade = models.CharField(max_length=200)
#     estado = models.CharField(max_length=100)
#     cep = models.CharField(max_length=20)
#     pais = models.CharField(max_length=100)

#     class Meta:
#         db_table = 'endereco'

#     def __str__(self):
#         return f"Endereço de {self.usuario.nome}"

# class Pagamento(models.Model):
#     PAGO = 'Pago'
#     PENDENTE = 'Pendente'
#     STATUS_CHOICES = [
#         (PAGO, 'Pago'),
#         (PENDENTE, 'Pendente'),
#     ]

#     pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
#     metodo_pagamento = models.CharField(max_length=50)
#     status_pagamento = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDENTE)
#     data_pagamento = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'pagamento'

#     def __str__(self):
#         return f"Pagamento do Pedido {self.pedido.id}"

# class Avaliacao(models.Model):
#     produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
#     usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
#     nota = models.IntegerField()
#     comentario = models.TextField(blank=True, null=True)
#     data_avaliacao = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'avaliacao'

#     def __str__(self):
#         return f"Avaliação de {self.usuario.nome} para {self.produto.nome}"

# class Administrador(models.Model):
#     nome = models.CharField(max_length=255)
#     email = models.EmailField(unique=True)
#     senha = models.CharField(max_length=255)
#     data_criacao = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'administrador'

#     def __str__(self):
#         return self.nome

# class LogAcao(models.Model):
#     admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)
#     acao = models.TextField()
#     data_acao = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'log_acao'

#     def __str__(self):
#         return f"Ação de {self.admin.nome} em {self.data_acao}"

# class Configuracao(models.Model):
#     chave = models.CharField(max_length=255)
#     valor = models.CharField(max_length=255)

#     class Meta:
#         db_table = 'configuracao'

#     def __str__(self):
#         return self.chave

# class HistoricoPedido(models.Model):
#     pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
#     status_antigo = models.CharField(max_length=50)
#     status_novo = models.CharField(max_length=50)
#     data_modificacao = models.DateTimeField(auto_now_add=True)
#     admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True)

#     class Meta:
#         db_table = 'historico_pedido'

#     def __str__(self):
#         return f"Histórico do Pedido {self.pedido.id}"
