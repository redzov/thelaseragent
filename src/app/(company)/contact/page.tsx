import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { OFFICES, SITE_NAME } from "@/lib/constants";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}. We have offices in Noblesville, Beverly Hills, and New York. Call us or send a message.`,
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME}. We have offices in Noblesville, Beverly Hills, and New York.`,
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

      {/* Office Cards */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Our Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFICES.map((office) => (
              <div
                key={office.name}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{office.name}</h3>

                <div className="flex items-start gap-3 mb-3">
                  <MapPin size={18} className="text-[#5ABA47] mt-0.5 flex-shrink-0" />
                  <a
                    href={office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c9c9c9] hover:text-[#5ABA47] transition-colors text-sm"
                  >
                    {office.address}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#5ABA47] flex-shrink-0" />
                  <a
                    href={office.phoneTel}
                    className="text-[#c9c9c9] hover:text-[#5ABA47] transition-colors text-sm"
                  >
                    {office.phone}
                  </a>
                </div>

                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-5 text-[#5ABA47] text-sm font-medium hover:underline"
                >
                  View on Map &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-[#0d0d0d]">
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
