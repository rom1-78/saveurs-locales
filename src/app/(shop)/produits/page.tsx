import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/produits/ProductCard";
import ProductFilters from "@/components/produits/ProductFilters";

interface Props {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    producer?: string;
    search?: string;
    page?: string;
  };
}

export const metadata = {
  title: "Catalogue",
};

export default async function CataloguePage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  const where = {
    isActive: true,
    ...(searchParams.category && {
      category: { slug: searchParams.category },
    }),
    ...(searchParams.producer && { producerId: searchParams.producer }),
    ...(searchParams.search && {
      OR: [
        { name: { contains: searchParams.search, mode: "insensitive" as const } },
        { description: { contains: searchParams.search, mode: "insensitive" as const } },
      ],
    }),
    ...((searchParams.minPrice || searchParams.maxPrice) && {
      price: {
        ...(searchParams.minPrice && { gte: Number(searchParams.minPrice) }),
        ...(searchParams.maxPrice && { lte: Number(searchParams.maxPrice) }),
      },
    }),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        producer: { select: { name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Nos produits locaux
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtres */}
        <aside className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            currentFilters={searchParams}
          />
        </aside>

        {/* Grille produits */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Aucun produit trouvé.</p>
              <p className="mt-2">Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {total} produit{total > 1 ? "s" : ""} trouvé
                {total > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <a
                        key={p}
                        href={`?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.search ? `&search=${searchParams.search}` : ""}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {p}
                      </a>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
