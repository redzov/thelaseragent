"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface SettingsMap {
  [key: string]: string;
}

const SETTINGS_SECTIONS = [
  {
    title: "Contact Information",
    fields: [
      { key: "PHONE_PRIMARY", label: "Primary Phone", type: "text" },
      { key: "PHONE_SECONDARY", label: "Secondary Phone", type: "text" },
      { key: "EMAIL_PRIMARY", label: "Primary Email", type: "email" },
      { key: "ADDRESS", label: "Address", type: "text" },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "SOCIAL_FACEBOOK", label: "Facebook URL", type: "url" },
      { key: "SOCIAL_INSTAGRAM", label: "Instagram URL", type: "url" },
      { key: "SOCIAL_TWITTER", label: "Twitter / X URL", type: "url" },
      { key: "SOCIAL_LINKEDIN", label: "LinkedIn URL", type: "url" },
      { key: "SOCIAL_YOUTUBE", label: "YouTube URL", type: "url" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object" && !data.error) setSettings(data);
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
        return;
      }

      setSuccess("Settings saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2196F3] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Settings</h2>

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
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3]"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#2196F3] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1976D2] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
