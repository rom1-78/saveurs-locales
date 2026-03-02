import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              Saveurs Locales
            </h3>
            <p className="text-gray-600 text-sm">
              La plateforme qui connecte les producteurs locaux avec les
              consommateurs. Des produits frais, de qualité, directement du
              producteur à votre table.
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/produits"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/inscription"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Devenir producteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-600">
                  Mentions légales
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Politique de confidentialité (RGPD)
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Conditions générales de vente
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Saveurs Locales. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}
