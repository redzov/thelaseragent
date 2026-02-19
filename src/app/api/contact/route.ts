import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    // TODO: Replace with Resend email integration
    console.log("[Contact Form Submission]", { name, email, phone, message });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
