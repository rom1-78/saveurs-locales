import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/utils/auth-guard";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Plus, Edit } from "lucide-react";

export const metadata = { title: "Mes produits" };

export default async function ProducteurProduitsPage() {
  const session = await requireRole("PRODUCTEUR");

  const products = await prisma.product.findMany({
    where: { producerId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes produits</h1>
        <Link href="/producteur/produits/nouveau">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">
            Vous n&apos;avez pas encore de produits.
          </p>
          <Link href="/producteur/produits/nouveau">
            <Button>Ajouter mon premier produit</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Produit
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Catégorie
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Prix
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Statut
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">{product.category.name}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    {formatPrice(product.price)}/{product.unit}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        product.stock <= 5 ? "text-red-600 font-medium" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={product.isActive ? "success" : "default"}>
                      {product.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/producteur/produits/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
