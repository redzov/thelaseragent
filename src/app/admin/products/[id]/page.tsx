"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Upload, X } from "lucide-react";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductData {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  price: string;
  callForPrice: boolean;
  manufacturer: string | null;
  model: string | null;
  year: number | null;
  status: string;
  featured: boolean;
  isDeal: boolean;
  sku: string | null;
  referenceNumber: string | null;
  applications: string | null;
  systemIncludes: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images: ProductImage[];
}

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    price: "",
    callForPrice: true,
    manufacturer: "",
    model: "",
    year: "",
    status: "ACTIVE",
    featured: false,
    isDeal: false,
    sku: "",
    referenceNumber: "",
    applications: "",
    systemIncludes: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          price: String(data.price || ""),
          callForPrice: data.callForPrice ?? true,
          manufacturer: data.manufacturer || "",
          model: data.model || "",
          year: data.year ? String(data.year) : "",
          status: data.status || "ACTIVE",
          featured: data.featured ?? false,
          isDeal: data.isDeal ?? false,
          sku: data.sku || "",
          referenceNumber: data.referenceNumber || "",
          applications: data.applications || "",
          systemIncludes: data.systemIncludes || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
        });
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  function updateField(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      const updated = await res.json();
      setProduct((prev) => (prev ? { ...prev, ...updated } : prev));
      setSuccess("Product saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.push("/admin/products");
    } catch {
      setError("Failed to delete product");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`/api/admin/products/${id}/images`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const newImage = await uploadRes.json();
          setProduct((prev) =>
            prev ? { ...prev, images: [...prev.images, newImage] } : prev
          );
        }
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleImageDelete(imageId: number) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(
        `/api/admin/products/${id}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setProduct((prev) =>
          prev
            ? { ...prev, images: prev.images.filter((i) => i.id !== imageId) }
            : prev
        );
      }
    } catch {
      setError("Failed to delete image");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5ABA47] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm">
        Product not found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Images Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Images</h3>
          <div className="mb-4 flex flex-wrap gap-4">
            {product.images.map((img) => (
              <div key={img.id} className="group relative">
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(img.id)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                {img.isPrimary && (
                  <span className="absolute bottom-1 left-1 rounded bg-[#5ABA47] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Basic Info */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Manufacturer
              </label>
              <input
                type="text"
                value={form.manufacturer}
                onChange={(e) => updateField("manufacturer", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reference Number
              </label>
              <input
                type="text"
                value={form.referenceNumber}
                onChange={(e) => updateField("referenceNumber", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              >
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.callForPrice}
                onChange={(e) => updateField("callForPrice", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#5ABA47] focus:ring-[#5ABA47]"
              />
              Call for Price
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#5ABA47] focus:ring-[#5ABA47]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isDeal}
                onChange={(e) => updateField("isDeal", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#5ABA47] focus:ring-[#5ABA47]"
              />
              Is Deal
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Description
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Long Description (HTML)
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) => updateField("longDescription", e.target.value)}
                rows={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Applications
              </label>
              <textarea
                value={form.applications}
                onChange={(e) => updateField("applications", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                System Includes
              </label>
              <textarea
                value={form.systemIncludes}
                onChange={(e) => updateField("systemIncludes", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">SEO</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#5ABA47] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#348923] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
