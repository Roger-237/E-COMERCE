import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Inscription() {
    const [formulaire, setFormulaire] = useState({ username: "", email: "", password: "", password2: "" });
    const [erreur, setErreur] = useState("");
    const naviguer = useNavigate();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const gererChangement = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
    };

    const gererSoumission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formulaire.password !== formulaire.password2) {
            setErreur("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const res = await fetch(`${BASEURL}/api/inscription/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formulaire),
            });
            const donnees = await res.json();
            if (res.ok) {
                naviguer("/connexion");
            } else {
                const message =
                    typeof donnees === "string"
                        ? donnees
                        : donnees.detail ||
                          Object.values(donnees).flat().join(" ") ||
                          "Échec de l'inscription";
                setErreur(message);
            }
        } catch (err) {
            setErreur("Erreur réseau");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
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
                        name="email"
                        type="email"
                        value={formulaire.email}
                        onChange={gererChangement}
                        placeholder="Adresse e-mail"
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
                    <input
                        name="password2"
                        type="password"
                        value={formulaire.password2}
                        onChange={gererChangement}
                        placeholder="Confirmer le mot de passe"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        S'inscrire
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Déjà un compte ? <Link to="/connexion" className="text-blue-600 hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}

export default Inscription;
