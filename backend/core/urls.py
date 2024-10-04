from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioCreateView, 
    UsuarioListView, 
    UsuarioDetailView, 
    UsuarioDeleteView, 
    ProdutoViewSet, 
    ImagemProdutoViewSet,
    PromocaoViewSet,
    CalcularFreteView,
    OpcaoFreteListView,
    ConfiguracaoFreteView,
    MarcaViewSet,
    CuponsViewSet,
    CarouselImageAdminViewSet,
    CarouselImageListView,
    CategoriaViewSet,
    ThemeConfigViewSet,
    CustomTokenObtainPairViewAdmin,
    CustomTokenObtainPairViewCliente,
    AplicarCupomView,
    ImagensPorProdutoView,
    ProdutosComImagensListView,
    Products_cupom_ViewSet
)
from django.conf import settings
from django.conf.urls.static import static

# Criação do router para registrar os ViewSets
router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'product_cupom', Products_cupom_ViewSet, basename='produto_cupom')
# URLs padrões do ProdutoViewSet:
# Listar Produtos: GET /api/produtos/
# Criar Produto: POST /api/produtos/
# Detalhes do Produto: GET /api/produtos/{id}/
# Atualizar Produto: PUT /api/produtos/{id}/
# Excluir Produto: DELETE /api/produtos/{id}/

router.register(r'imagens', ImagemProdutoViewSet, basename='imagemproduto')
router.register(r'opcoes-frete', OpcaoFreteListView, basename='opcao-frete')
router.register(r'marcas', MarcaViewSet, basename='marca')
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'promocoes', PromocaoViewSet, basename='promocoes')
router.register(r'cupons', CuponsViewSet, basename='cupons')
router.register(r'carousel-admin', CarouselImageAdminViewSet, basename='carousel-admin')

router.register(r'theme-config', ThemeConfigViewSet, basename='theme-config')

# Definindo as URLs
urlpatterns = [

    # Usuários
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detalhe'),
    path('usuarios/<int:pk>/delete/', UsuarioDeleteView.as_view(), name='usuario-delete'),

    # Autenticação  - Administrador
    path('token/admin/', CustomTokenObtainPairViewAdmin.as_view(), name='token_obtain_pair_admin'),
    path('token/cliente/', CustomTokenObtainPairViewCliente.as_view(), name='token_obtain_pair_cliente'),

    # Configuração de frete - Administrador
    path('configuracao-frete/', ConfiguracaoFreteView.as_view(), name='configuracao-frete'),

    # Categorias  - Administrador
    # path('createcategories/', CategoriasCreateView.as_view(), name='create_categorias'),
    # path('categories/list/', ListCategoriasView.as_view(), name='lista_categoria'),
    # path('categories/<int:pk>/', CategoriasDetailView.as_view(), name='Categorias-detalhe'),

    # Promocao  - Administrador
    path('aplicar-cupom/', AplicarCupomView.as_view(), name='aplicar-cupom'),
    
    # path('promocao/lista/', PromocaoListView.as_view(), name='promocao-lista'),  # Adicionado

    path('carousel-list/', CarouselImageListView.as_view(), name='carousel-lista'),

    

    # Calcular Frete
    path('calcular-frete/', CalcularFreteView.as_view(), name='calcular-frete'),

    # URL para acessar a área do cliente
    #path('products', ProductClientView.as_view(),  name='produtos-client'),  
    #path('produtos/<uuid:produto_uuid>/imagens/', ImagensPorProdutoView.as_view(), name='imagens-por-produto'),
    path('products-with-images/', ProdutosComImagensListView.as_view(), name='products-with-images'),
    
    # Rota cupom para cliente:
    #path('cupons-calc/', CuponsDetailView.as_view(), name='cupons-calc'),  # Adicionado
    # Incluindo as rotas do DefaultRouter
    path('', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

