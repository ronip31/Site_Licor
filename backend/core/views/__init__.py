from .user_views import UsuarioCreateView, UsuarioListView, UsuarioDetailView, UsuarioDeleteView
from .product_views import ProdutoViewSet,  MarcaViewSet
from .category_views import CategoriaViewSet
from .token_login_view import CustomTokenObtainPairView
from .promocao_view import PromocaoViewSet
from .calcular_frete_view import CalcularFreteView
from .configuracao_frete_view import OpcaoFreteListView, ConfiguracaoFreteView
from .cupom_view import CuponsViewSet, CuponsDetailView
from .imagem_produto_view import ImagemProdutoViewSet
from .imagem_carosel_view import CarouselImageAdminViewSet, CarouselImageListView
