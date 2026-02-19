"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellLaserFormSchema, type SellLaserFormValues } from "@/lib/validators";
import { LASER_BRANDS, SELL_FORM_LOOKING_TO } from "@/lib/constants";
import FormField from "./FormField";
import Button from "@/components/ui/Button";

export default function SellLaserForm() {
  const [submitState, setSubmitState] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SellLaserFormValues>({
    resolver: zodResolver(sellLaserFormSchema),
  });

  async function onSubmit(data: SellLaserFormValues) {
    setSubmitState(null);

    try {
      const res = await fetch("/api/sell-laser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSubmitState({
          type: "success",
          text: json.message || "Thank you! We'll review your submission and get back to you shortly.",
        });
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

  const brandOptions = LASER_BRANDS.map((b) => ({ value: b, label: b }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="First Name"
          name="firstName"
          placeholder="John"
          required
          error={errors.firstName?.message}
          inputProps={register("firstName")}
        />

        <FormField
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          required
          error={errors.lastName?.message}
          inputProps={register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          required
          error={errors.phone?.message}
          inputProps={register("phone")}
        />
      </div>

      <FormField
        label="Brand"
        name="brand"
        type="select"
        placeholder="Select a brand"
        options={brandOptions}
        required
        error={errors.brand?.message}
        inputProps={register("brand")}
      />

      <FormField
        label="Product Name"
        name="productName"
        placeholder="e.g. GentleMax Pro"
        required
        error={errors.productName?.message}
        inputProps={register("productName")}
      />

      <FormField
        label="Looking To"
        name="lookingTo"
        type="select"
        placeholder="Select an option"
        options={SELL_FORM_LOOKING_TO}
        required
        error={errors.lookingTo?.message}
        inputProps={register("lookingTo")}
      />

      <FormField
        label="Message"
        name="message"
        type="textarea"
        placeholder="Tell us more about your laser (condition, age, usage, etc.)"
        rows={5}
        error={errors.message?.message}
        inputProps={register("message")}
      />

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Submit
      </Button>

      {submitState && (
        <div
          className={`p-3 rounded-lg text-center text-sm ${
            submitState.type === "success"
              ? "bg-[#5ABA47]/10 text-[#5ABA47]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {submitState.text}
        </div>
      )}
    </form>
  );
}
