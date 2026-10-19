import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Outfit } from "next/font/google";
import "./globals.css";

const titulo = Fraunces({ subsets: ["latin"], variable: "--font-titulo", weight: ["500", "700", "900"] });
const texto = Inter({ subsets: ["latin"], variable: "--font-texto" });
const firma = Outfit({ subsets: ["latin"], variable: "--font-firma", weight: ["300", "500"] });

export const metadata: Metadata = {
  title: "Reto 101 apps · Brian Hawkins",
  description: "Reto 101 apps de Brian Hawkins: cada app publicada, con vista previa, código y en vivo.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable} ${firma.variable}`}>
      <body className="min-h-screen font-texto antialiased">{children}</body>
    </html>
  );
}
