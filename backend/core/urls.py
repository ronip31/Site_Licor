from django.urls import path
from .views import UsuarioCreateView, UsuarioListView, UsuarioDetailView, UsuarioDeleteView, ListProductView, ProducCreateView, ProductDetailView, ProducDeleteView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detalhe'),
    path('usuarios/<int:pk>/delete/', UsuarioDeleteView.as_view(), name='usuario-delete'),

    # Validação acesso admin
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    #PRODUTOS ADMIN
    path('createproduct/', ProducCreateView.as_view(), name='create_protuct'),
    path('product/lista/', ListProductView.as_view(), name='lista_protuct'),
    path('product/<int:pk>/', ProductDetailView.as_view(), name='detalhe_protuct'),
    path('product/<int:pk>/delete/', ProducDeleteView.as_view(), name='delete_protuct'),
    

]
