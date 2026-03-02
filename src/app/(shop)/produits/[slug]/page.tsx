import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AddToCartButton from "@/components/panier/AddToCartButton";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  return {
    title: product?.name || "Produit non trouvé",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      producer: { select: { id: true, name: true } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                🌿
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos produit */}
        <div>
          <Badge variant="info" className="mb-3">
            {product.category.name}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-500 mb-4">
            par{" "}
            <span className="font-medium text-green-600">
              {product.producer.name}
            </span>
          </p>

          {avgRating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">
                {"★".repeat(Math.round(avgRating))}
                {"☆".repeat(5 - Math.round(avgRating))}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews.length} avis)
              </span>
            </div>
          )}

          <div className="text-3xl font-bold text-green-700 mb-2">
            {formatPrice(product.price)}
            <span className="text-base font-normal text-gray-500 ml-1">
              /{product.unit}
            </span>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <Badge variant="success">
                En stock ({product.stock} disponibles)
              </Badge>
            ) : (
              <Badge variant="danger">Rupture de stock</Badge>
            )}
          </div>

          {product.stock > 0 && <AddToCartButton productId={product.id} />}

          <div className="mt-8 prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-gray-900">
              Description
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Avis */}
          {product.reviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Avis clients
              </h3>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {review.user.name}
                      </span>
                      <span className="text-amber-500 text-sm">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
