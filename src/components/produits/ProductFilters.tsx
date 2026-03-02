"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  currentFilters: Record<string, string | undefined>;
}

export default function ProductFilters({
  categories,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search || "");

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/produits?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/produits");
    setSearch("");
  }

  return (
    <div className="space-y-6">
      {/* Recherche */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Rechercher</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilter("search", search);
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Tomates, miel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" size="sm">
            OK
          </Button>
        </form>
      </div>

      {/* Catégories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Catégories</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => applyFilter("category", "")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !currentFilters.category
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Toutes les catégories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => applyFilter("category", cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentFilters.category === cat.slug
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Prix */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Prix</h3>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={currentFilters.minPrice}
            onBlur={(e) => applyFilter("minPrice", e.target.value)}
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={currentFilters.maxPrice}
            onBlur={(e) => applyFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Reset */}
      <Button variant="ghost" className="w-full" onClick={clearFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
