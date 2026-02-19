import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const categoryNames = product.categories.map((c) => c.category.name);

  return (
    <div>
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
        {product.title}
      </h1>

      {/* Price */}
      <div className="mb-6">
        {product.callForPrice || product.price === 0 ? (
          <span className="text-2xl font-semibold text-[#5ABA47]">
            Call for Price
          </span>
        ) : (
          <span className="text-2xl font-semibold text-white">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Status badge */}
      {product.status === "SOLD" && (
        <div className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full mb-6">
          SOLD
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Description
          </h2>
          {product.longDescription ? (
            <div
              className="prose-dark text-[#c9c9c9] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          ) : (
            <p className="text-[#c9c9c9] leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      )}

      {/* Attributes Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">
          Specifications
        </h2>
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {product.manufacturer && (
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium w-1/3">
                    Manufacturer
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {product.manufacturer}
                  </td>
                </tr>
              )}
              {product.model && (
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium w-1/3">
                    Model
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {product.model}
                  </td>
                </tr>
              )}
              {product.year && (
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium w-1/3">
                    Year
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {product.year}
                  </td>
                </tr>
              )}
              {product.applications && (
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium w-1/3">
                    Applications
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {product.applications}
                  </td>
                </tr>
              )}
              {product.sku && (
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium w-1/3">
                    SKU
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {product.sku}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reference Number */}
      {product.referenceNumber && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Reference Number
          </h2>
          <p className="text-[#c9c9c9] bg-[#1a1a1a] rounded-lg px-4 py-3 inline-block">
            {product.referenceNumber}
          </p>
        </div>
      )}

      {/* System Includes */}
      {product.systemIncludes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            System Includes
          </h2>
          <p className="text-[#c9c9c9] leading-relaxed">
            {product.systemIncludes}
          </p>
        </div>
      )}

      {/* Categories */}
      {categoryNames.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((name) => (
              <span
                key={name}
                className="px-3 py-1.5 text-xs font-medium text-[#5ABA47] bg-[#5ABA47]/10 border border-[#5ABA47]/20 rounded-full"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
