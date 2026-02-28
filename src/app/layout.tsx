import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
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
      <head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1534965587945781&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="font-[family-name:var(--font-poppins)] antialiased">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1534965587945781');fbq('track','PageView');`}
        </Script>
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
