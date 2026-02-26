import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Buy Used Cosmetic, Medical & Aesthetic Lasers for Sale`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME} offers used Cosmetic, Medical, and aesthetic Lasers for Sale. Buy used laser equipment from Lumenis, Candela, Alma, Cynosure, Palomar, Syneron & more.`,
  keywords: [
    "used lasers for sale",
    "cosmetic lasers",
    "medical lasers",
    "aesthetic lasers",
    "used laser equipment",
    "laser machines for sale",
    "Candela",
    "Cynosure",
    "Lumenis",
    "Palomar",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Buy Used Cosmetic, Medical & Aesthetic Lasers for Sale`,
    description: `${SITE_NAME} offers used Cosmetic, Medical, and aesthetic Lasers for Sale. Buy used laser equipment from Lumenis, Candela, Alma, Cynosure, Palomar, Syneron & more.`,
    images: [
      {
        url: "/images/site/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-[family-name:var(--font-poppins)] antialiased">
        <CartProvider>
          <TopBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
