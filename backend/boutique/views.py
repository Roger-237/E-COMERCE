from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import InscriptionSerializer, UtilisateurSerializer
from rest_framework import status
from .models import Produit, Categorie, Panier, ArticlePanier, Commande, ArticleCommande
from .serializers import ProduitSerializer, CategorieSerializer, PanierSerializer, ArticlePanierSerializer


@api_view(['GET'])
def obtenir_produits(request):
    produits = Produit.objects.all()
    serialiseur = ProduitSerializer(produits, many=True)
    return Response(serialiseur.data)


@api_view(['GET'])
def obtenir_produit(request, pk):
    try:
        produit = Produit.objects.get(id=pk)
        serialiseur = ProduitSerializer(produit, context={'request': request})
        return Response(serialiseur.data)
    except Produit.DoesNotExist:
        return Response({'erreur': 'Produit introuvable'}, status=404)


@api_view(['GET'])
def obtenir_categories(request):
    categories = Categorie.objects.all()
    serialiseur = CategorieSerializer(categories, many=True)
    return Response(serialiseur.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtenir_panier(request):
    panier, cree = Panier.objects.get_or_create(utilisateur=request.user)
    serialiseur = PanierSerializer(panier)
    return Response(serialiseur.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ajouter_au_panier(request):
    identifiant_produit = request.data.get('product_id')
    produit = Produit.objects.get(id=identifiant_produit)
    panier, cree = Panier.objects.get_or_create(utilisateur=request.user)
    article, cree = ArticlePanier.objects.get_or_create(panier=panier, produit=produit)
    if not cree:
        article.quantite += 1
        article.save()
    return Response({'message': 'Produit ajouté au panier', 'panier': PanierSerializer(panier).data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mettre_a_jour_quantite(request):
    identifiant_article = request.data.get('item_id')
    quantite = request.data.get('quantity')

    if not identifiant_article or quantite is None:
        return Response({'erreur': "L'identifiant de l'article et la quantité sont requis"}, status=400)

    try:
        article = ArticlePanier.objects.get(id=identifiant_article)
        if int(quantite) < 1:
            article.delete()
            return Response({'erreur': 'La quantité doit être au minimum 1'}, status=400)

        article.quantite = quantite
        article.save()
        serialiseur = ArticlePanierSerializer(article)
        return Response(serialiseur.data)
    except ArticlePanier.DoesNotExist:
        return Response({'erreur': 'Article du panier introuvable'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def supprimer_du_panier(request):
    identifiant_article = request.data.get('item_id')
    ArticlePanier.objects.filter(id=identifiant_article).delete()
    return Response({'message': 'Article supprimé du panier'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_commande(request):
    try:
        donnees = request.data
        nom = donnees.get('name')
        adresse = donnees.get('address')
        telephone = donnees.get('phone')
        mode_paiement = donnees.get('payment_method', 'COD')

        # Validation du numéro de téléphone
        if not telephone.isdigit() or len(telephone) < 10:
            return Response({'erreur': 'Numéro de téléphone invalide'}, status=400)

        # Récupérer le panier de l'utilisateur
        panier, cree = Panier.objects.get_or_create(utilisateur=request.user)
        if not panier.articles.exists():
            return Response({'erreur': 'Le panier est vide'}, status=400)

        total = sum([article.produit.prix * article.quantite for article in panier.articles.all()])

        commande = Commande.objects.create(utilisateur=request.user, montant_total=total)

        for article in panier.articles.all():
            ArticleCommande.objects.create(
                commande=commande,
                produit=article.produit,
                quantite=article.quantite,
                prix=article.produit.prix
            )
        # Vider le panier
        panier.articles.all().delete()
        return Response({'message': 'Commande créée avec succès', 'identifiant_commande': commande.id})
    except Exception as e:
        return Response({'erreur': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def vue_inscription(request):
    serialiseur = InscriptionSerializer(data=request.data)
    if serialiseur.is_valid():
        utilisateur = serialiseur.save()
        return Response({"message": "Utilisateur créé avec succès", "utilisateur": UtilisateurSerializer(utilisateur).data}, status=status.HTTP_201_CREATED)
    return Response(serialiseur.errors, status=status.HTTP_400_BAD_REQUEST)
