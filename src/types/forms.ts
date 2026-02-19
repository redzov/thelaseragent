export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface GetPriceFormData {
  name: string;
  email: string;
  phone?: string;
  productSlug: string;
  productTitle: string;
  message?: string;
}

export interface MakeOfferFormData {
  name: string;
  email: string;
  phone?: string;
  productSlug: string;
  productTitle: string;
  offerAmount: string;
  message?: string;
}

export interface SellLaserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  brand: string;
  productName: string;
  lookingTo: "buy" | "sell" | "trade" | "service";
  message?: string;
}
