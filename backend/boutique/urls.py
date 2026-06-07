from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('inscription/', views.vue_inscription),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('produits/', views.obtenir_produits),
    path('produits/<int:pk>/', views.obtenir_produit),
    path('categories/', views.obtenir_categories),
    path('panier/', views.obtenir_panier),
    path('panier/ajouter/', views.ajouter_au_panier),
    path('panier/supprimer/', views.supprimer_du_panier),
    path('panier/mettre-a-jour/', views.mettre_a_jour_quantite),
    path('commandes/creer/', views.creer_commande),
]
