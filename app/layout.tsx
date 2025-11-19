import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "La Habitación Tortuga [LHT] | Canal de YouTube",
  description: "Bienvenido a la habitación donde hablamos de lo que vivimos. Un canal de YouTube donde Alberto y David charlan sobre lo que les pasa, lo que descubren y lo que les hace pensar. Sin guión, sin filtros, sin postureo.",
  keywords: ["youtube", "conversaciones", "tecnología", "IA", "proyectos", "emprendimiento", "aprendizaje", "la habitacion tortuga", "lht", "alberto", "david"],
  authors: [{ name: "Alberto y David" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: "La Habitación Tortuga [LHT]",
    description: "Un canal de YouTube donde pasan cosas. Conversaciones reales desde la habitación. Sin guión, sin filtros, sin postureo.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga [LHT]',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Habitación Tortuga [LHT]",
    description: "Canal de YouTube. Conversaciones sin guión desde la habitación.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-black selection:bg-black selection:text-white overflow-x-hidden`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-black focus:text-white focus:rounded-lg focus:font-bold focus:uppercase focus:text-sm focus:tracking-widest"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
