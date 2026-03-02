import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    images: string[];
    stock: number;
    category: { name: string };
    producer: { name: string | null };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Link href={`/produits/${product.slug}`}>
      <article className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🌿</span>
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="danger">Rupture de stock</Badge>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-4">
          <Badge variant="info" className="mb-2">
            {product.category.name}
          </Badge>
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            par {product.producer.name || "Producteur"}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-green-700">
              {formatPrice(product.price)}
              <span className="text-sm font-normal text-gray-500">
                /{product.unit}
              </span>
            </span>
            {inStock && (
              <span className="text-xs text-green-600">En stock</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
