import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FournisseurPanier } from "./context/ContextePanier";
import BarreNavigation from "./components/BarreNavigation";
import RouteurPrive from "./components/RouteurPrive";
import ListeProduits from "./pages/ListeProduits";
import DetailsProduit from "./pages/DetailsProduit";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import PagePanier from "./pages/PagePanier";
import PageCommande from "./pages/PageCommande";

function App() {
    return (
        <FournisseurPanier>
            <Router>
                <BarreNavigation />
                <Routes>
                    <Route path="/" element={<ListeProduits />} />
                    <Route path="/produit/:id" element={<DetailsProduit />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/panier" element={<RouteurPrive enfants={<PagePanier />} />} />
                    <Route path="/commande" element={<RouteurPrive enfants={<PageCommande />} />} />
                </Routes>
            </Router>
        </FournisseurPanier>
    );
}

export default App;
