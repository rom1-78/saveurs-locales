import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/** Vérifie que l'utilisateur est connecté et a le bon rôle */
export async function requireRole(role: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/connexion");
  }

  if (session.user.role !== role && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
}
