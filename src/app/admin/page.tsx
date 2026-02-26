"use client";

import { useEffect, useState } from "react";
import { Package, Inbox, InboxIcon, Star } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalSubmissions: number;
  unreadSubmissions: number;
  totalReviews: number;
}

interface Submission {
  id: number;
  formType: string;
  email: string | null;
  data: Record<string, string>;
  productSlug: string | null;
  createdAt: string;
  read: boolean;
}

interface DashboardData {
  stats: DashboardStats;
  recentSubmissions: Submission[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((d) => {
        if (d.stats) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5ABA47] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm">
        Failed to load dashboard data.
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: data.stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Leads",
      value: data.stats.totalSubmissions,
      icon: Inbox,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Unread Leads",
      value: data.stats.unreadSubmissions,
      icon: InboxIcon,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Reviews",
      value: data.stats.totalReviews,
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-lg ${card.bg} p-3`}>
                  <Icon size={24} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Submissions
          </h3>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {data.recentSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                data.recentSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-gray-100 text-sm"
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
                      {sub.data?.name || sub.data?.firstName || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {sub.email || "-"}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
