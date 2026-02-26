"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Submission {
  id: number;
  formType: string;
  email: string | null;
  data: Record<string, string>;
  productSlug: string | null;
  createdAt: string;
  read: boolean;
}

interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export default function AdminSubmissionsPage() {
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    });
    if (filter) params.set("formType", filter);

    try {
      const res = await fetch(`/api/admin/submissions?${params}`);
      const d = await res.json();
      if (d.submissions) setData(d);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleMarkRead(id: number) {
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              submissions: prev.submissions.map((s) =>
                s.id === id ? { ...s, read: true } : s
              ),
            }
          : prev
      );
    } catch {
      alert("Failed to mark as read");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this submission?")) return;
    try {
      await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      fetchSubmissions();
    } catch {
      alert("Failed to delete submission");
    }
  }

  const formTypes = [
    "",
    "contact",
    "quote",
    "sell",
    "service",
    "trade",
    "financing",
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3]"
        >
          <option value="">All Types</option>
          {formTypes
            .filter((t) => t)
            .map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2196F3] border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!data || data.submissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  ) : (
                    data.submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className={`border-b border-gray-100 text-sm ${
                          !sub.read ? "bg-green-50/50" : ""
                        }`}
                      >
                        <td className="px-6 py-3 text-gray-600">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            {sub.formType}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-900">
                          {sub.data?.name ||
                            sub.data?.firstName ||
                            sub.data?.full_name ||
                            "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {sub.email || sub.data?.email || "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {sub.productSlug || "-"}
                        </td>
                        <td className="px-6 py-3">
                          {sub.read ? (
                            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                              Read
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {!sub.read && (
                              <button
                                onClick={() => handleMarkRead(sub.id)}
                                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                                title="Mark as read"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
                <p className="text-sm text-gray-500">
                  Page {data.page} of {data.totalPages} ({data.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page >= data.totalPages}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
