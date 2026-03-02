import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/utils/auth-guard";
import { formatPrice } from "@/lib/utils";
import Card, { CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";

export const metadata = { title: "Administration" };

export default async function AdminDashboardPage() {
  await requireRole("ADMIN");

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
    usersByRole,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
  ]);

  const revenue = revenueResult._sum.totalAmount || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Tableau de bord
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Utilisateurs</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Produits</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
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
              <p className="text-2xl font-bold">{formatPrice(revenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition utilisateurs */}
        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4">
              Utilisateurs par rôle
            </h2>
            <div className="space-y-3">
              {usersByRole.map((group) => (
                <div
                  key={group.role}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">{group.role}</span>
                  <span className="font-semibold">{group._count.role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dernières commandes */}
        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4">
              Dernières commandes
            </h2>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-mono text-gray-500">
                      {order.orderNumber}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {order.user.name}
                    </span>
                  </div>
                  <span className="font-semibold text-green-700">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <Link
          href="/admin/utilisateurs"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Gérer les utilisateurs →
        </Link>
      </div>
    </div>
  );
}
