from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioCreateView, 
    UsuarioListView, 
    UsuarioDetailView, 
    UsuarioDeleteView, 
    CustomTokenObtainPairView,
    ProdutoViewSet, 
    ImagemProdutoViewSet,
    ListCategoriasView, 
    CategoriasCreateView,
    DescontoCreateView,
    DescontoListView,
    CalcularFreteView,
    OpcaoFreteListView,
    ConfiguracaoFreteView,
    MarcaViewSet,
    CategoriasDetailView
)
from django.conf import settings
from django.conf.urls.static import static

# Criação do router para registrar os ViewSets
router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
# URLs padrões do ProdutoViewSet:
# Listar Produtos: GET /api/produtos/
# Criar Produto: POST /api/produtos/
# Detalhes do Produto: GET /api/produtos/{id}/
# Atualizar Produto: PUT /api/produtos/{id}/
# Excluir Produto: DELETE /api/produtos/{id}/

router.register(r'imagens', ImagemProdutoViewSet, basename='imagem')
router.register(r'opcoes-frete', OpcaoFreteListView, basename='opcao-frete')
router.register(r'marca', MarcaViewSet, basename='marca')
#router.register(r'produtos', ProdutoViewSet, basename='produto')

# Definindo as URLs
urlpatterns = [

    # Usuários
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detalhe'),
    path('usuarios/<int:pk>/delete/', UsuarioDeleteView.as_view(), name='usuario-delete'),

    # Autenticação  - Administrador
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Categorias  - Administrador
    path('createcategories/', CategoriasCreateView.as_view(), name='create_categorias'),
    path('categories/list/', ListCategoriasView.as_view(), name='lista_categoria'),
    path('categories/<int:pk>/', CategoriasDetailView.as_view(), name='Categorias-detalhe'),

    # Descontos  - Administrador
    path('descontos/', DescontoCreateView.as_view(), name='desconto-create'),  # Adicionado
    path('descontos/lista/', DescontoListView.as_view(), name='desconto-lista'),  # Adicionado

    # Configuração de frete - Administrador
    path('configuracao-frete/', ConfiguracaoFreteView.as_view(), name='configuracao-frete'),

    # Calcular Frete
    path('calcular-frete/', CalcularFreteView.as_view(), name='calcular-frete'),

    # Incluindo as rotas do DefaultRouter
    path('', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

