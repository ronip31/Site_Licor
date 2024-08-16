from django.urls import path
from .views import UsuarioCreateView, UsuarioListView, UsuarioDetailView, UsuarioDeleteView

urlpatterns = [
    path('usuarios/', UsuarioCreateView.as_view(), name='usuario-create'),
    path('usuarios/lista/', UsuarioListView.as_view(), name='usuario-lista'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detalhe'),
     path('usuarios/<int:pk>/delete/', UsuarioDeleteView.as_view(), name='usuario-delete'),
]
