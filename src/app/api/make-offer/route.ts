import { NextResponse } from "next/server";
import { makeOfferFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = makeOfferFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = result.data;

    // TODO: Replace with Resend email integration
    console.log("[Make Offer Form Submission]", data);

    return NextResponse.json({
      success: true,
      message: "Thank you for your offer! We'll review it and get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
