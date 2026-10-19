import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const titulo = Fraunces({ subsets: ["latin"], variable: "--font-titulo", weight: ["500", "700", "900"] });
const texto = Inter({ subsets: ["latin"], variable: "--font-texto" });

export const metadata: Metadata = {
  title: "101 great ideas · Reto 100 apps",
  description: "Índice de las apps del reto de 100 apps de Brian, y el lugar donde nace cada idea nueva.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable}`}>
      <body className="min-h-screen font-texto antialiased">{children}</body>
    </html>
  );
}
