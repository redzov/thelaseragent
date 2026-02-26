import { NextResponse } from "next/server";
import { sellLaserFormSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sellLaserFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, brand, productName, lookingTo, message } =
      result.data;

    await prisma.formSubmission.create({
      data: {
        formType: "sell-laser",
        email,
        data: { firstName, lastName, email, phone, brand, productName, lookingTo, message },
      },
    });

    await sendTelegramNotification(
      `🔔 New Sell Laser Inquiry\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nBrand: ${brand}\nProduct: ${productName}\nLooking To: ${lookingTo}\nMessage: ${message || "N/A"}`
    );

    return NextResponse.json({
      success: true,
      message:
        "Thank you! We'll review your submission and get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
