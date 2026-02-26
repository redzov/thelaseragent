"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productInquirySchema,
  type ProductInquiryValues,
} from "@/lib/validators";

interface ProductActionsProps {
  product: {
    slug: string;
    title: string;
    price: number;
    callForPrice: boolean;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInquiryValues>({
    resolver: zodResolver(productInquirySchema),
    defaultValues: {
      productSlug: product.slug,
      productTitle: product.title,
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ProductInquiryValues) => {
    setSubmitStatus(null);
    try {
      const res = await fetch("/api/product-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        setSubmitStatus({ type: "success", message: json.message });
        reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: json.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const inputClassName =
    "bg-[#111] border border-[#333] rounded text-white px-4 py-3 w-full focus:border-[#5ABA47] focus:outline-none transition-colors placeholder:text-gray-600";
  const labelClassName =
    "block uppercase text-xs font-semibold text-gray-400 tracking-wider mb-1.5";

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-1">
        Request Information
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Interested in this laser? Fill out the form below and we&apos;ll get
        back to you.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("productSlug")} />
        <input type="hidden" {...register("productTitle")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inquiry-name" className={labelClassName}>
              Name *
            </label>
            <input
              id="inquiry-name"
              type="text"
              placeholder="Your name"
              className={inputClassName}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inquiry-email" className={labelClassName}>
              Email *
            </label>
            <input
              id="inquiry-email"
              type="email"
              placeholder="Your email"
              className={inputClassName}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-phone" className={labelClassName}>
            Phone *
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            placeholder="Your phone number"
            className={inputClassName}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="inquiry-message" className={labelClassName}>
            Message
          </label>
          <textarea
            id="inquiry-message"
            placeholder="Tell us about your needs..."
            className={`${inputClassName} h-28 resize-y`}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#5ABA47] hover:bg-[#4ea93d] text-white font-semibold py-3 px-8 rounded transition-colors w-full uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "SEND REQUEST"}
        </button>

        {submitStatus && (
          <p
            className={`text-sm text-center mt-2 ${
              submitStatus.type === "success"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {submitStatus.message}
          </p>
        )}
      </form>
    </div>
  );
}
