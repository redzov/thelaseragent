"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators";
import FormField from "./FormField";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setSubmitState(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSubmitState({ type: "success", text: json.message || "Thank you! We'll be in touch shortly." });
        reset();
      } else {
        setSubmitState({
          type: "error",
          text: json.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitState({ type: "error", text: "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        label="Name"
        name="name"
        placeholder="Your full name"
        required
        error={errors.name?.message}
        inputProps={register("name")}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        required
        error={errors.email?.message}
        inputProps={register("email")}
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        placeholder="(555) 123-4567"
        error={errors.phone?.message}
        inputProps={register("phone")}
      />

      <FormField
        label="Message"
        name="message"
        type="textarea"
        placeholder="How can we help you?"
        required
        rows={5}
        error={errors.message?.message}
        inputProps={register("message")}
      />

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Send Message
      </Button>

      {submitState && (
        <div
          className={`p-3 rounded-lg text-center text-sm ${
            submitState.type === "success"
              ? "bg-[#2196F3]/10 text-[#2196F3]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {submitState.text}
        </div>
      )}
    </form>
  );
}
