import { Link, useNavigate } from 'react-router-dom';
import { utiliserPanier } from '../context/ContextePanier';
import { effacerJetons, obtenirJetonAcces } from '../utils/authentification';

function BarreNavigation() {
    const { articlesPanier } = utiliserPanier();
    const naviguer = useNavigate();

    const nombreArticles = articlesPanier.reduce((total, article) => total + article.quantite, 0);

    const estConnecte = !!obtenirJetonAcces();

    const gererDeconnexion = () => {
        effacerJetons();
        naviguer('/connexion');
    };

    return (
        <nav className='bg-white shadow-md px-6 py-6 flex justify-between items-center fixed w-full top-0 z-50'>
            <Link to='/' className='text-2xl font-bold text-gray-800'>
                🛍️ GROUP4-COMMERCE
            </Link>

            <div className='flex items-center gap-6'>
                {!estConnecte ? (
                    <>
                        <Link to='/connexion' className='text-gray-800 hover:text-gray-600 font-medium'>
                            Connexion
                        </Link>
                        <Link to='/inscription' className='text-gray-800 hover:text-gray-600 font-medium'>
                            Inscription
                        </Link>
                    </>
                ) : (
                    <button onClick={gererDeconnexion} className='text-gray-800 hover:text-gray-600 font-medium'>
                        Déconnexion
                    </button>
                )}
            </div>

            <Link to='/panier' className='relative text-gray-800 hover:text-gray-600 font-medium'>
                🛒 Panier
                {nombreArticles > 0 && (
                    <span className='absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2'>
                        {nombreArticles}
                    </span>
                )}
            </Link>
        </nav>
    )
}

export default BarreNavigation;
