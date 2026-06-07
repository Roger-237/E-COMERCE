from django.contrib import admin
from .models import Categorie, ArticleCommande, Produit, ProfilUtilisateur, Commande, Panier, ArticlePanier


admin.site.register(Categorie)
admin.site.register(Produit)
admin.site.register(ProfilUtilisateur)
admin.site.register(Commande)
admin.site.register(ArticleCommande)
admin.site.register(Panier)
admin.site.register(ArticlePanier)
