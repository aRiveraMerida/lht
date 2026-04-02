import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL('https://lahabitaciontortuga.com'),
  title: {
    default: "La Habitación Tortuga [LHT] | Laboratorio abierto sobre IA",
    template: "%s | La Habitación Tortuga [LHT]",
  },
  description: "Un laboratorio abierto sobre inteligencia artificial. Sin filtro. Sin teoría. Experimentos reales por Alberto Rivera y David Dix Hidalgo.",
  keywords: [
    "la habitacion tortuga",
    "lht",
    "laboratorio IA",
    "estrategia IA",
    "adopción inteligencia artificial",
    "automatizaciones IA",
    "inteligencia artificial",
    "IA empresas",
    "alberto rivera",
    "david dix hidalgo",
  ],
  authors: [
    { name: "Alberto Rivera" },
    { name: "David Dix Hidalgo" },
  ],
  creator: "Alberto Rivera",
  publisher: "La Habitación Tortuga",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://lahabitaciontortuga.com",
    siteName: "La Habitación Tortuga [LHT]",
    title: "La Habitación Tortuga [LHT] — Laboratorio abierto sobre IA",
    description: "Un laboratorio abierto sobre inteligencia artificial. Sin filtro. Sin teoría. Experimentos reales.",
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga [LHT]',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aRiveraMerida",
    creator: "@aRiveraMerida",
    title: "La Habitación Tortuga [LHT]",
    description: "Un laboratorio abierto sobre inteligencia artificial. Sin filtro. Sin teoría. Experimentos reales.",
    images: ['/favicon.svg'],
  },
  alternates: {
    canonical: "https://lahabitaciontortuga.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'La Habitación Tortuga',
    alternateName: 'LHT',
    url: 'https://lahabitaciontortuga.com',
    description: 'Un laboratorio abierto sobre inteligencia artificial. Sin filtro. Sin teoría. Experimentos reales por Alberto Rivera y David Dix Hidalgo.',
    inLanguage: 'es-ES',
    author: [
      {
        '@type': 'Person',
        name: 'Alberto Rivera',
        url: 'https://www.linkedin.com/in/albertoriveramerida',
      },
      {
        '@type': 'Person',
        name: 'David Dix Hidalgo',
        url: 'https://www.linkedin.com/in/daviddixhidalgo',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'La Habitación Tortuga',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lahabitaciontortuga.com/favicon.svg',
      },
    },
    sameAs: [
      'https://www.linkedin.com/in/albertoriveramerida',
      'https://www.linkedin.com/in/daviddixhidalgo',
    ],
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="font-sans antialiased bg-paper text-ink overflow-x-hidden"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-bark focus:text-cream focus:rounded-lg focus:font-bold focus:uppercase focus:text-sm focus:tracking-widest"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
