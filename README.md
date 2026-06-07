# 🛍️ GROUPE4 - Boutique en ligne

Projet e-commerce complet avec **React + TypeScript** (frontend) et **Django REST Framework** (backend), utilisant l'authentification JWT.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **Python 3.10+** → [télécharger ici](https://www.python.org/downloads/)
- **Node.js 18+** → [télécharger ici](https://nodejs.org/)
- **MySQL Server** → [XAMPP](https://www.apachefriends.org/) (le plus simple) ou [MySQL Community](https://dev.mysql.com/downloads/)
- **Git** → [télécharger ici](https://git-scm.com/)

---

## 🚀 Installation et lancement

### 1. Cloner le projet

```bash
git clone <lien-du-repo>
cd E-COMERCE
```

---

### 2. Base de données MySQL

1. Démarrez **MySQL** (via XAMPP ou votre installation)
2. Ouvrez un terminal MySQL :

```bash
mysql -u root
```

3. Créez la base de données :

```sql
CREATE DATABASE ecommerce;
EXIT;
```

> 💡 Si votre MySQL a un mot de passe, modifiez `backend/.env` :
> ```
> DB_PASSWORD=votre_mot_de_passe
> ```

---

### 3. Backend (Django)

```bash
# Aller dans le dossier backend
cd backend

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur Mac/Linux :
source venv/bin/activate

# Appliquer les migrations (créer les tables)
python manage.py migrate

# Créer un super-utilisateur (admin Django) - optionnel
python manage.py createsuperuser

# Lancer le serveur backend
python manage.py runserver
```

Le backend tourne sur **http://127.0.0.1:8000**

> 📌 Le fichier `backend/.env` contient la configuration de la base de données.
> Modifiez-le si vos identifiants MySQL sont différents.

---

### 4. Frontend (React + Vite)

Ouvrez un **nouveau terminal** :

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (si node_modules n'existe pas)
npm install

# Lancer le serveur frontend
npm run dev
```

Le frontend tourne sur **http://localhost:5173**

---

## 📁 Structure du projet

```
E-COMERCE/
├── backend/
│   ├── backend/          ← Configuration Django (settings, urls, wsgi)
│   ├── boutique/         ← Application principale
│   │   ├── models.py     ← Modèles (Categorie, Produit, Panier, Commande...)
│   │   ├── views.py      ← Vues API (obtenir_produits, ajouter_au_panier...)
│   │   ├── serializers.py← Sérialiseurs DRF
│   │   ├── urls.py       ← Routes API
│   │   └── admin.py      ← Configuration admin Django
│   ├── media/            ← Images des produits uploadées
│   ├── venv/             ← Environnement virtuel Python
│   ├── .env              ← Variables d'environnement (base de données)
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/   ← Composants réutilisables
│   │   │   ├── BarreNavigation.tsx    ← Barre de navigation
│   │   │   ├── CarteProduit.tsx       ← Carte d'un produit
│   │   │   └── RouteurPrive.tsx       ← Route protégée (auth requise)
│   │   ├── context/
│   │   │   └── ContextePanier.tsx     ← État global du panier
│   │   ├── pages/
│   │   │   ├── ListeProduits.tsx      ← Page d'accueil (liste)
│   │   │   ├── DetailsProduit.tsx     ← Détail d'un produit
│   │   │   ├── PagePanier.tsx         ← Panier
│   │   │   ├── PageCommande.tsx       ← Passer commande
│   │   │   ├── Connexion.tsx          ← Page de connexion
│   │   │   └── Inscription.tsx        ← Page d'inscription
│   │   ├── utils/
│   │   │   └── authentification.tsx   ← Gestion des jetons JWT
│   │   ├── App.tsx        ← Routes principales
│   │   └── main.tsx       ← Point d'entrée React
│   ├── .env               ← URL du backend
│   └── package.json
│
└── .gitignore
```

---

## 🔗 Routes API (Backend)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/produits/` | Liste tous les produits |
| GET | `/api/produits/<id>/` | Détail d'un produit |
| GET | `/api/categories/` | Liste les catégories |
| POST | `/api/inscription/` | Créer un compte |
| POST | `/api/token/` | Se connecter (JWT) |
| POST | `/api/token/refresh/` | Rafraîchir le jeton |
| GET | `/api/panier/` | Voir son panier (auth requis) |
| POST | `/api/panier/ajouter/` | Ajouter au panier (auth requis) |
| POST | `/api/panier/supprimer/` | Supprimer du panier (auth requis) |
| POST | `/api/panier/mettre-a-jour/` | Modifier quantité (auth requis) |
| POST | `/api/commandes/creer/` | Passer une commande (auth requis) |

---

## 🗺️ Routes Frontend

| URL | Page |
|-----|------|
| `/` | Liste des produits (accueil) |
| `/produit/:id` | Détail du produit |
| `/connexion` | Connexion |
| `/inscription` | Inscription |
| `/panier` | Panier (auth requis) |
| `/commande` | Passer commande (auth requis) |

---

## ⚙️ Technologies utilisées

- **Frontend** : React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend** : Django 6, Django REST Framework, SimpleJWT
- **Base de données** : MySQL
- **Authentification** : JWT (JSON Web Tokens)

---

## ❓ Problèmes courants

### "ModuleNotFoundError: No module named 'rest_framework'"
→ Activez le venv : `venv\Scripts\activate` puis `pip install -r requirements.txt`

### "Access denied for user 'root'"
→ Vérifiez vos identifiants MySQL dans `backend/.env`

### Le panier donne une 403
→ Assurez-vous d'être connecté (les jetons JWT sont nécessaires)

### Port déjà utilisé
→ Changez le port : `python manage.py runserver 8080` et modifiez `frontend/.env`
