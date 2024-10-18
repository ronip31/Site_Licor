from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioCreateView, 
    UsuarioListView, 
    UsuarioMeView, 
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
    Products_cupom_ViewSet,
    ProdutosImagensSemDescricaoListView,
    CarrinhoViewSet,
    generate_session_id_view,
    ProdutoImportView,
    ProdutoTemplateDownloadView
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

router.register(r'carrinho', CarrinhoViewSet, basename='carrinho')

# Definindo as URLs
urlpatterns = [

    #rotas para download e import dos produdos - ADMIN
    path('produtos/import/', ProdutoImportView.as_view(), name='produto-import'),
    path('produtos/template/download/', ProdutoTemplateDownloadView.as_view(), name='produto-template-download'),

    # Usuários
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),

    path('usuarios/me/', UsuarioMeView.as_view(), name='usuario-me'),

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


    #Buscar todos produtos
    path('products-with-images/', ProdutosImagensSemDescricaoListView.as_view(), name='products-with-images'),
    
    #buscar detalhes do produto
    path('products-details/<slug:slug>/', ProdutosComImagensListView.as_view(), name='products-details'),
    
    # Rota para gerar o session_id do cliente
    path('generate-session-id/', generate_session_id_view, name='generate_session_id'),

    # Incluindo as rotas do DefaultRouter
    path('', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

