import { Link } from 'react-router-dom'

interface Produit {
    id: number
    nom: string
    description: string
    prix: string
    image: string
    categorie: {
        id: number
        nom: string
        slug: string
    }
}

function CarteProduit({ produit }: { produit: Produit }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || ''
    return (
        <Link to={`/produit/${produit.id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
            <img src={`${BASEURL}${produit.image}`} alt={produit.nom} className="w-full h-40 object-cover rounded-lg" />
            <h2 className="text-lg font-semibold mt-2">{produit.nom}</h2>
            <p className="text-sm text-gray-500">{produit.description}</p>
            <p className="text-sm text-gray-500">{produit.prix} €</p>
            <p className="text-sm text-gray-500">{produit.categorie.nom}</p>
        </Link>
    )
}

export default CarteProduit
