import { Navigate, useLocation } from 'react-router-dom';
import { obtenirJetonAcces } from '../utils/authentification';

interface RouteurPriveProps {
    enfants: React.ReactNode;
}

function RouteurPrive({ enfants }: RouteurPriveProps) {
    const estConnecte = !!obtenirJetonAcces();
    const localisation = useLocation();

    return estConnecte ? <>{enfants}</> : <Navigate to={`/connexion?de=${encodeURIComponent(localisation.pathname)}`} />;
}

export default RouteurPrive;
