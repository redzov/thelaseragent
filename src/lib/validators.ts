import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const getPriceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  productSlug: z.string().min(1, "Product slug is required"),
  productTitle: z.string().min(1, "Product title is required"),
  message: z.string().optional(),
});

export const makeOfferFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  productSlug: z.string().min(1, "Product slug is required"),
  productTitle: z.string().min(1, "Product title is required"),
  offerAmount: z.string().min(1, "Please enter an offer amount"),
  message: z.string().optional(),
});

export const sellLaserFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  brand: z.string().min(1, "Please select a brand"),
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  lookingTo: z.enum(["buy", "sell", "trade", "service"], {
    message: "Please select what you're looking to do",
  }),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type GetPriceFormValues = z.infer<typeof getPriceFormSchema>;
export type MakeOfferFormValues = z.infer<typeof makeOfferFormSchema>;
export type SellLaserFormValues = z.infer<typeof sellLaserFormSchema>;

export const productInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  message: z.string().optional(),
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
});

export type ProductInquiryValues = z.infer<typeof productInquirySchema>;
