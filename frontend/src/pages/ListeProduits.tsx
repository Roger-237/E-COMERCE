import { useEffect, useState } from "react";
import CarteProduit from "../components/CarteProduit";

function ListeProduits() {
    const [produits, setProduits] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState(null);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        fetch(`${BASEURL}/api/produits/`)
            .then(reponse => reponse.json())
            .then(donnees => {
                setProduits(donnees);
                setChargement(false);
            })
            .catch(erreur => {
                setErreur(erreur);
                setChargement(false);
            });
    }, []);

    if (chargement) {
        return <div>Chargement...</div>;
    }

    if (erreur) {
        return <div>Erreur : {erreur.message}</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Liste des Produits</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produits.length > 0 ? (
                        produits.map((produit: any) => (
                            <CarteProduit key={produit.id} produit={produit} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">Aucun produit trouvé</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListeProduits;
