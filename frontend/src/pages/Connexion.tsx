import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { sauvegarderJetons } from "../utils/authentification";

function Connexion() {
    const [formulaire, setFormulaire] = useState({ username: "", password: "" });
    const [erreur, setErreur] = useState("");
    const naviguer = useNavigate();
    const [parametresRecherche] = useSearchParams();
    const depuis = parametresRecherche.get("de") || "/";
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const gererChangement = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
    };

    const gererSoumission = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASEURL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formulaire),
            });
            const donnees = await res.json();
            if (res.ok) {
                sauvegarderJetons(donnees);
                naviguer(depuis);
            } else {
                setErreur(donnees.detail || "Échec de la connexion");
            }
        } catch (err) {
            setErreur("Erreur réseau");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
                {erreur && <p className="text-red-500 text-sm mb-4">{erreur}</p>}
                <form onSubmit={gererSoumission} className="space-y-4">
                    <input
                        name="username"
                        value={formulaire.username}
                        onChange={gererChangement}
                        placeholder="Nom d'utilisateur"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="password"
                        type="password"
                        value={formulaire.password}
                        onChange={gererChangement}
                        placeholder="Mot de passe"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Se connecter
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Pas encore de compte ? <Link to="/inscription" className="text-blue-600 hover:underline">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}

export default Connexion;
