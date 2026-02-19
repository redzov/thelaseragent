import { ProductListItem } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductListItem[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 text-gray-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-white text-lg font-medium mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          slug={product.slug}
          title={product.title}
          price={product.price}
          callForPrice={product.callForPrice}
          manufacturer={product.manufacturer}
          year={product.year}
          primaryImage={product.primaryImage}
        />
      ))}
    </div>
  );
}
