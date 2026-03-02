import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Props {
  params: { id: string };
}

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "info" },
  PROCESSING: { label: "En préparation", variant: "info" },
  SHIPPED: { label: "Expédiée", variant: "info" },
  DELIVERED: { label: "Livrée", variant: "success" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default async function OrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/connexion");

  const order = await prisma.order.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, unit: true } } },
      },
      address: true,
      delivery: true,
    },
  });

  if (!order) notFound();

  const status = statusLabels[order.status] || statusLabels.PENDING;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Commande {order.orderNumber}
      </h1>
      <p className="text-gray-500 mb-6">{formatDate(order.createdAt)}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statut */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Statut</h2>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            {order.delivery && (
              <div className="text-sm text-gray-600 space-y-1">
                {order.delivery.trackingNumber && (
                  <p>
                    Numéro de suivi :{" "}
                    <span className="font-mono">
                      {order.delivery.trackingNumber}
                    </span>
                  </p>
                )}
                {order.delivery.estimatedDate && (
                  <p>
                    Livraison estimée :{" "}
                    {formatDate(order.delivery.estimatedDate)}
                  </p>
                )}
                {order.delivery.deliveredAt && (
                  <p>Livrée le : {formatDate(order.delivery.deliveredAt)}</p>
                )}
              </div>
            )}
          </div>

          {/* Articles */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Articles</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatPrice(item.unitPrice)}/
                      {item.product.unit}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-green-700">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="border border-gray-200 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold mb-3">Adresse de livraison</h2>
          <div className="text-sm text-gray-600 space-y-1">
            {order.address.label && (
              <p className="font-medium">{order.address.label}</p>
            )}
            <p>{order.address.street}</p>
            <p>
              {order.address.postalCode} {order.address.city}
            </p>
            <p>{order.address.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
