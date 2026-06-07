import { Link } from "react-router-dom";
import { utiliserPanier } from "../context/ContextePanier";

function PagePanier() {
    const { articlesPanier, total, mettreAJourQuantite, supprimerDuPanier } = utiliserPanier();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "";

    if (articlesPanier.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 pt-24 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Votre Panier</h1>
                    <p className="text-gray-500 mb-6">Votre panier est vide.</p>
                    <Link to="/" className="text-blue-600 hover:underline">
                        Continuer vos achats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-24 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    {articlesPanier.map((article) => (
                        <div key={article.id} className="flex items-center gap-4 border-b pb-4">
                            <img
                                src={`${BASEURL}${article.image_produit}`}
                                alt={article.nom_produit}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{article.nom_produit}</h3>
                                <p className="text-gray-500">{article.prix_produit} €</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => mettreAJourQuantite(article.id, article.quantite - 1)}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="font-semibold">{article.quantite}</span>
                                <button
                                    onClick={() => mettreAJourQuantite(article.id, article.quantite + 1)}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => supprimerDuPanier(article.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-4">
                        <h2 className="text-xl font-bold">Total : {total} €</h2>
                        <Link
                            to="/commande"
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Commander
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PagePanier;
