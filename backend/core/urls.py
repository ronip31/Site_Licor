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
    CategoriasCreateView
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

# Definindo as URLs
urlpatterns = [

    # Usuários
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detalhe'),
    path('usuarios/<int:pk>/delete/', UsuarioDeleteView.as_view(), name='usuario-delete'),

    # Autenticação
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Categorias
    path('createcategories/', CategoriasCreateView.as_view(), name='create_categorias'),
    path('categories/list/', ListCategoriasView.as_view(), name='lista_categoria'),

    # Incluindo as rotas do DefaultRouter
    path('', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

