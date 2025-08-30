import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CookieConsentWrapper from "../components/CookieConsentWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profs Académie - Plateforme éducative québécoise",
  description: "Apprenez avec des enseignants passionnés. Plateforme éducative québécoise pour enfants et familles.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Profs Académie - Plateforme éducative québécoise",
    description: "Apprenez avec des enseignants passionnés. Plateforme éducative québécoise pour enfants et familles.",
    images: ["/logo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr-CA">
      <body className={inter.className}>
        <Providers>
          {children}
          <CookieConsentWrapper />
        </Providers>
      </body>
    </html>
  );
}
