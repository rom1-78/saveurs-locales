import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/utils/auth-guard";
import { formatPrice } from "@/lib/utils";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Package, ShoppingCart, TrendingUp, Plus } from "lucide-react";

export const metadata = { title: "Espace Producteur" };

export default async function ProducteurDashboardPage() {
  const session = await requireRole("PRODUCTEUR");

  const [products, orders, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { producerId: session.user.id } }),
    prisma.orderItem.count({
      where: { product: { producerId: session.user.id } },
    }),
    prisma.orderItem.aggregate({
      where: {
        product: { producerId: session.user.id },
        order: { paymentStatus: "PAID" },
      },
      _sum: { unitPrice: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Espace Producteur
        </h1>
        <Link href="/producteur/produits/nouveau">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Produits</p>
              <p className="text-2xl font-bold">{products}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes</p>
              <p className="text-2xl font-bold">{orders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenu total</p>
              <p className="text-2xl font-bold">
                {formatPrice(totalRevenue._sum.unitPrice || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/producteur/produits">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-6">
              <h2 className="text-lg font-semibold mb-2">Mes produits</h2>
              <p className="text-gray-500">
                Gérez votre catalogue, ajoutez de nouveaux produits et mettez à
                jour vos stocks.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/producteur/commandes">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-6">
              <h2 className="text-lg font-semibold mb-2">Commandes reçues</h2>
              <p className="text-gray-500">
                Suivez et gérez les commandes de vos clients.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
