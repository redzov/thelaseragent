import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}. Send us a message about buying, selling, or servicing laser equipment.`,
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME}. Send us a message about buying, selling, or servicing laser equipment.`,
  },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Have a question about buying, selling, or servicing laser equipment? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-black">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Send Us a Message
          </h2>
          <p className="text-[#c9c9c9] text-center mb-8">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
