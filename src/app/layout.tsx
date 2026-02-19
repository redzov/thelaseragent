import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thelaseragent.com"),
  title: {
    default: "The Laser Agent | Buy Used Cosmetic, Medical & Aesthetic Lasers for Sale",
    template: "%s | The Laser Agent",
  },
  description:
    "The Laser Agent offers used Cosmetic, Medical, and aesthetic Lasers for Sale. Buy used laser equipment from Lumenis, Candela, Alma, Cynosure, Palomar, Syneron & more.",
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
  authors: [{ name: "The Laser Agent" }],
  creator: "The Laser Agent",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.thelaseragent.com",
    siteName: "The Laser Agent",
    title: "The Laser Agent | Buy Used Cosmetic, Medical & Aesthetic Lasers for Sale",
    description:
      "The Laser Agent offers used Cosmetic, Medical, and aesthetic Lasers for Sale. Buy used laser equipment from Lumenis, Candela, Alma, Cynosure, Palomar, Syneron & more.",
    images: [
      {
        url: "/images/site/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Laser Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TheLaserAgent",
    creator: "@TheLaserAgent",
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
