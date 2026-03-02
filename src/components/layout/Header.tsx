"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { ShoppingCart, Menu, X, LogOut, Package, LayoutDashboard } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">
              Saveurs Locales
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/produits"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Catalogue
            </Link>

            {session?.user ? (
              <>
                {/* Liens selon le rôle */}
                {session.user.role === "PRODUCTEUR" && (
                  <Link
                    href="/producteur"
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
                  >
                    <Package className="w-4 h-4" />
                    Espace producteur
                  </Link>
                )}
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Administration
                  </Link>
                )}

                <Link
                  href="/panier"
                  className="relative text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                </Link>

                <Link
                  href="/commandes"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Mes commandes
                </Link>

                {/* Menu utilisateur */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/connexion">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/inscription">
                  <Button size="sm">Inscription</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/produits"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catalogue
            </Link>
            {session?.user ? (
              <>
                {session.user.role === "PRODUCTEUR" && (
                  <Link
                    href="/producteur"
                    className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Espace producteur
                  </Link>
                )}
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Administration
                  </Link>
                )}
                <Link
                  href="/panier"
                  className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Panier
                </Link>
                <Link
                  href="/commandes"
                  className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mes commandes
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 pt-2">
                <Link href="/auth/connexion" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/inscription" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Inscription</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
