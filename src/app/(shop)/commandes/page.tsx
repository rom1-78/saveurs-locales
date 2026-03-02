import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Mes commandes" };

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "info" },
  PROCESSING: { label: "En préparation", variant: "info" },
  SHIPPED: { label: "Expédiée", variant: "info" },
  DELIVERED: { label: "Livrée", variant: "success" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default async function CommandesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/connexion");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
      delivery: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Aucune commande pour le moment.</p>
          <Link
            href="/produits"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabels[order.status] || statusLabels.PENDING;
            return (
              <Link
                key={order.id}
                href={`/commandes/${order.id}`}
                className="block border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <span className="font-mono text-sm text-gray-500">
                      {order.orderNumber}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  {order.items.length} article{order.items.length > 1 ? "s" : ""}
                </div>

                <div className="text-lg font-bold text-green-700">
                  {formatPrice(order.totalAmount)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
