import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requeteAuthentifiee } from "../utils/authentification";
import { utiliserPanier } from "../context/ContextePanier";

function PageCommande() {
    const [formulaire, setFormulaire] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const naviguer = useNavigate();
    const { viderPanier } = utiliserPanier();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const gererChangement = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFormulaire({ ...formulaire, [e.target.name]: e.target.value });

    const gererSoumission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await requeteAuthentifiee(`${BASEURL}/api/commandes/creer/`, {
                method: "POST",
                body: JSON.stringify(formulaire),
            });

            const donnees = await res.json();

            if (res.ok) {
                viderPanier();
                alert("Commande passée avec succès !");
                naviguer("/");
            } else {
                alert(donnees.erreur || "Échec de la commande");
            }
        } catch (erreur) {
            console.error("Erreur lors de la commande :", erreur);
        }
    };

    return (
        <div className="pt-20 p-6">
            <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
                <h1 className="text-2xl font-bold mb-4">Passer la Commande</h1>

                <form onSubmit={gererSoumission} className="space-y-3">
                    <input
                        name="name"
                        value={formulaire.name}
                        onChange={gererChangement}
                        placeholder="Votre Nom"
                        required
                        className="w-full p-2 border rounded"
                    />

                    <input
                        name="address"
                        value={formulaire.address}
                        onChange={gererChangement}
                        placeholder="Adresse"
                        required
                        className="w-full p-2 border rounded"
                    />

                    <input
                        name="phone"
                        value={formulaire.phone}
                        onChange={gererChangement}
                        placeholder="Numéro de téléphone"
                        required
                        className="w-full p-2 border rounded"
                    />

                    <select
                        name="payment_method"
                        value={formulaire.payment_method}
                        onChange={gererChangement}
                        className="w-full p-2 border rounded"
                    >
                        <option value="COD">Paiement à la livraison</option>
                        <option value="ONLINE">Paiement en ligne</option>
                    </select>

                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Passer la commande
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PageCommande;
