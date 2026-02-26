import { prisma } from "@/lib/prisma";

export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: ["TG_BOT_TOKEN", "TG_CHAT_ID"] } },
    });

    const token = settings.find((s) => s.key === "TG_BOT_TOKEN")?.value;
    const chatId = settings.find((s) => s.key === "TG_CHAT_ID")?.value;

    if (!token || !chatId) return false;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}
