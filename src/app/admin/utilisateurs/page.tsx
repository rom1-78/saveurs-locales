import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/utils/auth-guard";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export const metadata = { title: "Gestion des utilisateurs" };

const roleBadges: Record<string, "default" | "success" | "info"> = {
  CLIENT: "default",
  PRODUCTEUR: "success",
  ADMIN: "info",
};

export default async function AdminUtilisateursPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          products: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestion des utilisateurs
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Nom
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Rôle
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Commandes
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Produits
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Inscription
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium">
                  {user.name || "—"}
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <Badge variant={roleBadges[user.role] || "default"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">{user._count.orders}</td>
                <td className="py-3 px-4">{user._count.products}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
