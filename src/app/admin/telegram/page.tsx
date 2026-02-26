"use client";

import { useEffect, useState } from "react";
import { Save, Send, CheckCircle, XCircle } from "lucide-react";

export default function AdminTelegramPage() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [testResult, setTestResult] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    fetch("/api/admin/telegram")
      .then((res) => res.json())
      .then((data) => {
        setBotToken(data.TG_BOT_TOKEN || "");
        setChatId(data.TG_CHAT_ID || "");
      })
      .catch(() => setError("Failed to load Telegram settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/telegram", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TG_BOT_TOKEN: botToken,
          TG_CHAT_ID: chatId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      setSuccess("Telegram settings saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save Telegram settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTestResult(null);
    setError("");
    setTesting(true);

    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });

      const data = await res.json();
      setTestResult(data.success ? "success" : "error");
      if (!data.success) {
        setError(data.error || "Test message failed to send");
      }
    } catch {
      setTestResult("error");
      setError("Failed to send test message");
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5ABA47] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Telegram Notifications
      </h2>

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
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Bot Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bot Token
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
                placeholder="123456:ABC-DEF..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Get a token from @BotFather on Telegram
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Chat / Group ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#5ABA47] focus:outline-none focus:ring-1 focus:ring-[#5ABA47]"
                placeholder="-1001234567890"
              />
              <p className="mt-1 text-xs text-gray-500">
                Chat ID or group ID where notifications will be sent
              </p>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Test Connection
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Send a test message to verify your Telegram bot configuration is
            working correctly.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !botToken || !chatId}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <Send size={16} />
              {testing ? "Sending..." : "Send Test Message"}
            </button>
            {testResult === "success" && (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle size={16} />
                Test message sent successfully
              </div>
            )}
            {testResult === "error" && (
              <div className="flex items-center gap-1.5 text-sm text-red-600">
                <XCircle size={16} />
                Failed to send test message
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#5ABA47] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#348923] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
