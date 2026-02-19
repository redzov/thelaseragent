import { ProductListItem } from "@/types/product";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: ProductListItem[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
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
    </section>
  );
}
