import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { requeteAuthentifiee, obtenirJetonAcces } from "../utils/authentification";

interface ArticlePanier {
    id: number;
    produit: number;
    nom_produit: string;
    prix_produit: string;
    image_produit: string;
    quantite: number;
    sous_total: string;
}

interface ContextePanierType {
    articlesPanier: ArticlePanier[];
    total: string | number;
    ajouterAuPanier: (identifiantProduit: number) => Promise<{ succes: boolean; erreur?: string }>;
    supprimerDuPanier: (identifiantArticle: number) => Promise<void>;
    mettreAJourQuantite: (identifiantArticle: number, quantite: number) => Promise<void>;
    viderPanier: () => void;
    recupererPanier: () => Promise<void>;
}

const ContextePanier = createContext<ContextePanierType | undefined>(undefined);

export const FournisseurPanier = ({ children }: { children: ReactNode }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [articlesPanier, setArticlesPanier] = useState<ArticlePanier[]>([]);
    const [total, setTotal] = useState<string | number>(0);

    const recupererPanier = useCallback(async () => {
        const jeton = obtenirJetonAcces();
        if (!jeton) return;
        try {
            const res = await requeteAuthentifiee(`${BASEURL}/api/panier/`);
            if (!res.ok) return;
            const donnees = await res.json();
            setArticlesPanier(donnees.articles || []);
            setTotal(donnees.total || 0);
        } catch (erreur) {
            console.error("Erreur lors de la récupération du panier :", erreur);
        }
    }, [BASEURL]);

    useEffect(() => {
        recupererPanier();
    }, [recupererPanier]);

    const ajouterAuPanier = async (identifiantProduit: number): Promise<{ succes: boolean; erreur?: string }> => {
        const jeton = obtenirJetonAcces();
        if (!jeton) {
            return { succes: false, erreur: "Veuillez vous connecter d'abord pour ajouter des articles au panier." };
        }
        try {
            const res = await requeteAuthentifiee(`${BASEURL}/api/panier/ajouter/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: identifiantProduit }),
            });
            if (!res.ok) {
                return { succes: false, erreur: "Échec de l'ajout du produit au panier." };
            }
            await recupererPanier();
            return { succes: true };
        } catch (erreur) {
            console.error("Erreur lors de l'ajout au panier :", erreur);
            return { succes: false, erreur: "Erreur réseau. Veuillez réessayer." };
        }
    };

    const supprimerDuPanier = async (identifiantArticle: number) => {
        try {
            await requeteAuthentifiee(`${BASEURL}/api/panier/supprimer/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item_id: identifiantArticle }),
            });
            recupererPanier();
        } catch (erreur) {
            console.error("Erreur lors de la suppression du panier :", erreur);
        }
    };

    const mettreAJourQuantite = async (identifiantArticle: number, quantite: number) => {
        if (quantite < 1) {
            await supprimerDuPanier(identifiantArticle);
            return;
        }
        try {
            await requeteAuthentifiee(`${BASEURL}/api/panier/mettre-a-jour/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item_id: identifiantArticle, quantity: quantite }),
            });
            recupererPanier();
        } catch (erreur) {
            console.error("Erreur lors de la mise à jour de la quantité :", erreur);
        }
    };

    const viderPanier = () => {
        setArticlesPanier([]);
        setTotal(0);
    };

    return (
        <ContextePanier.Provider value={{ articlesPanier, total, ajouterAuPanier, supprimerDuPanier, mettreAJourQuantite, viderPanier, recupererPanier }}>
            {children}
        </ContextePanier.Provider>
    );
};

export const utiliserPanier = () => {
    const contexte = useContext(ContextePanier);
    if (!contexte) throw new Error("utiliserPanier doit être utilisé dans FournisseurPanier");
    return contexte;
};
