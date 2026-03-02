import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/utils/auth-guard";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Commandes reçues" };

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "info" },
  PROCESSING: { label: "En préparation", variant: "info" },
  SHIPPED: { label: "Expédiée", variant: "info" },
  DELIVERED: { label: "Livrée", variant: "success" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default async function ProducteurCommandesPage() {
  const session = await requireRole("PRODUCTEUR");

  // Récupérer les commandes contenant les produits du producteur
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: { product: { producerId: session.user.id } },
      },
      paymentStatus: "PAID",
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        where: { product: { producerId: session.user.id } },
        include: { product: { select: { name: true } } },
      },
      delivery: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Commandes reçues
      </h1>

      {orders.length === 0 ? (
        <p className="text-center py-12 text-gray-500 text-lg">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabels[order.status] || statusLabels.PENDING;
            const orderTotal = order.items.reduce(
              (sum, item) => sum + item.unitPrice * item.quantity,
              0
            );
            return (
              <Link
                key={order.id}
                href={`/producteur/commandes/${order.id}`}
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
                <p className="text-sm text-gray-600 mb-1">
                  Client : {order.user.name} ({order.user.email})
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {order.items.length} article{order.items.length > 1 ? "s" : ""}
                  {" : "}
                  {order.items.map((i) => i.product.name).join(", ")}
                </p>
                <p className="font-bold text-green-700">
                  {formatPrice(orderTotal)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
