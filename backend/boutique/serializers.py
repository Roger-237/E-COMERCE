from rest_framework import serializers
from .models import Produit, Categorie, Panier, ArticlePanier
from django.contrib.auth.models import User


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'


class ProduitSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True)

    class Meta:
        model = Produit
        fields = '__all__'


class ArticlePanierSerializer(serializers.ModelSerializer):
    nom_produit = serializers.CharField(source='produit.nom', read_only=True)
    prix_produit = serializers.DecimalField(source='produit.prix', max_digits=10, decimal_places=2, read_only=True)
    image_produit = serializers.ImageField(source='produit.image', read_only=True)

    class Meta:
        model = ArticlePanier
        fields = '__all__'


class PanierSerializer(serializers.ModelSerializer):
    articles = ArticlePanierSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Panier
        fields = '__all__'


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, donnees):
        if donnees['password'] != donnees['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return donnees

    def create(self, donnees_validees):
        nom_utilisateur = donnees_validees['username']
        courriel = donnees_validees.get('email', '')
        mot_de_passe = donnees_validees['password']
        utilisateur = User.objects.create_user(username=nom_utilisateur, email=courriel, password=mot_de_passe)
        return utilisateur
