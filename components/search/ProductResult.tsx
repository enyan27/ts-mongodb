import Link from "next/link";
import Stars from "@/components/product/Stars";

export default function ProductResult({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 overflow-hidden">
      <Link className="block" href={`/product/view/${product._id}`}>
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          {/* display product name and rating */}
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Stars rating={product.avgRating} />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {product.avgRating?.toFixed(1) || 0}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
