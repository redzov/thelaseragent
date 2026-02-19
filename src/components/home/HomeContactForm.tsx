"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function HomeContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Thank you! We'll be in touch shortly.",
        });
        setName("");
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-20 bg-[#1a1a1a]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
          Get In Touch
        </h2>
        <p className="text-[#c9c9c9] text-center mb-8">
          Have a question about buying or selling laser equipment? Drop us a
          line.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="sr-only">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-[#333] text-white placeholder:text-[#666] focus:outline-none focus:border-[#5ABA47] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-[#333] text-white placeholder:text-[#666] focus:outline-none focus:border-[#5ABA47] transition-colors"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Submit
          </Button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm ${
              message.type === "success"
                ? "bg-[#5ABA47]/10 text-[#5ABA47]"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
}
