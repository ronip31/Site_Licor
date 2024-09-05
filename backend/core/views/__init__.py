from .user_views import UsuarioCreateView, UsuarioListView, UsuarioDetailView, UsuarioDeleteView
from .product_views import ProdutoViewSet, ImagemProdutoViewSet, MarcaViewSet
from .category_views import ListCategoriasView, CategoriasCreateView, CategoriasDetailView
from .token_login_view import CustomTokenObtainPairView
from .desconto_view import DescontoCreateView, DescontoListView
from .calcular_frete_view import CalcularFreteView
from .configuracao_frete_view import OpcaoFreteListView, ConfiguracaoFreteView
