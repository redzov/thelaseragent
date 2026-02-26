"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Star, Upload } from "lucide-react";

export default function AdminReviewNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    authorName: "",
    text: "",
    rating: 5,
    photo: "",
    source: "google",
    isPublished: true,
  });

  function updateField(field: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateField("photo", data.url);
      }
    } catch {
      setError("Failed to upload photo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create review");
        return;
      }

      router.push("/admin/reviews");
    } catch {
      setError("Failed to create review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/reviews"
          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">New Review</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Author Name
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => updateField("authorName", e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                value={form.source}
                onChange={(e) => updateField("source", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
              >
                <option value="google">Google</option>
                <option value="yelp">Yelp</option>
                <option value="facebook">Facebook</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Review Text
            </label>
            <textarea
              value={form.text}
              onChange={(e) => updateField("text", e.target.value)}
              required
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateField("rating", i)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      i <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {form.rating}/5
              </span>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Photo
            </label>
            {form.photo && (
              <div className="mb-3">
                <Image
                  src={form.photo}
                  alt="Review photo"
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-lg object-cover"
                />
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => updateField("isPublished", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#5ABA47] focus:ring-[#5ABA47]"
              />
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#5ABA47] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#348923] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Creating..." : "Create Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
