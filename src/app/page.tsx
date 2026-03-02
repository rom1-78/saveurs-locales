import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-amber-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Des <span className="text-green-600">saveurs authentiques</span>,
            <br />
            directement de nos producteurs
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez des produits frais et locaux, cultivés avec passion par
            des producteurs de votre région. Du champ à votre assiette.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produits">
              <Button size="lg">Découvrir le catalogue</Button>
            </Link>
            <Link href="/auth/inscription">
              <Button variant="outline" size="lg">
                Devenir producteur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir Saveurs Locales ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Produits frais</h3>
              <p className="text-gray-600">
                Des produits récoltés et préparés par des producteurs locaux,
                garantissant une fraîcheur optimale.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Circuit court</h3>
              <p className="text-gray-600">
                Achetez directement aux producteurs. Moins
                d&apos;intermédiaires, des prix justes pour tous.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Livraison suivie</h3>
              <p className="text-gray-600">
                Suivez votre commande en temps réel, de la préparation à la
                livraison à votre porte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes producteur local ?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Rejoignez notre plateforme et vendez vos produits directement aux
            consommateurs de votre région.
          </p>
          <Link href="/auth/inscription">
            <Button variant="secondary" size="lg">
              Rejoindre Saveurs Locales
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
