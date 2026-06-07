import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { utiliserPanier } from "../context/ContextePanier";

interface Categorie {
    id: number;
    nom: string;
    slug: string;
}

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: string;
    image: string;
    categorie: Categorie;
    cree_le: string;
}

function DetailsProduit() {
    const { id } = useParams<{ id: string }>();
    const [produit, setProduit] = useState<Produit | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [messagePanier, setMessagePanier] = useState<{ texte: string; type: "erreur" | "succes" } | null>(null);
    const { ajouterAuPanier } = utiliserPanier();
    const naviguer = useNavigate();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "";

    useEffect(() => {
        fetch(`${BASEURL}/api/produits/${id}/`)
            .then((reponse) => {
                if (!reponse.ok) throw new Error("Produit introuvable");
                return reponse.json();
            })
            .then((donnees) => {
                setProduit(donnees);
                setChargement(false);
            })
            .catch((err) => {
                setErreur(err.message);
                setChargement(false);
            });
    }, [id]);

    const gererAjoutAuPanier = async () => {
        if (!produit) return;
        setMessagePanier(null);
        const resultat = await ajouterAuPanier(produit.id);
        if (resultat.succes) {
            setMessagePanier({ texte: "Produit ajouté au panier !", type: "succes" });
        } else {
            setMessagePanier({ texte: resultat.erreur || "Une erreur est survenue.", type: "erreur" });
            if (resultat.erreur?.includes("connecter")) {
                setTimeout(() => {
                    naviguer(`/connexion?de=/produit/${produit.id}`);
                }, 1500);
            }
        }
    };

    if (chargement) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-lg">Chargement...</p>
            </div>
        );
    }

    if (erreur) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
                <p className="text-red-500 text-lg">{erreur}</p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Retour aux produits
                </Link>
            </div>
        );
    }

    if (!produit) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/"
                    className="inline-block mb-6 text-blue-600 hover:underline"
                >
                    &larr; Retour aux produits
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                        <img
                            src={`${produit.image}`}
                            alt={produit.nom}
                            className="w-full h-80 md:h-full object-cover"
                        />
                    </div>

                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {produit.categorie.nom}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">
                            {produit.nom}
                        </h1>
                        <p className="text-gray-600 mt-4 leading-relaxed">
                            {produit.description}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-6">
                            {produit.prix} €
                        </p>

                        {messagePanier && (
                            <div
                                className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                                    messagePanier.type === "erreur"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {messagePanier.texte}
                            </div>
                        )}

                        <button
                            onClick={gererAjoutAuPanier}
                            className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsProduit;
