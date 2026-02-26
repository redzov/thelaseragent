import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: ["TG_BOT_TOKEN", "TG_CHAT_ID"] } },
    });

    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { TG_BOT_TOKEN, TG_CHAT_ID } = body;

    const operations = [];

    if (TG_BOT_TOKEN !== undefined) {
      operations.push(
        prisma.siteSettings.upsert({
          where: { key: "TG_BOT_TOKEN" },
          update: { value: TG_BOT_TOKEN },
          create: { key: "TG_BOT_TOKEN", value: TG_BOT_TOKEN },
        })
      );
    }

    if (TG_CHAT_ID !== undefined) {
      operations.push(
        prisma.siteSettings.upsert({
          where: { key: "TG_CHAT_ID" },
          update: { value: TG_CHAT_ID },
          create: { key: "TG_CHAT_ID", value: TG_CHAT_ID },
        })
      );
    }

    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update Telegram settings" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const success = await sendTelegramNotification(
      "This is a test message from Phoenix Aesthetics Admin Panel. If you see this, your Telegram integration is working correctly!"
    );

    if (success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to send message. Check your bot token and chat ID.",
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send test message" },
      { status: 500 }
    );
  }
}
