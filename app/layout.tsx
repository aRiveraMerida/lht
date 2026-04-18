import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lahabitaciontortuga.com'),
  title: {
    default: "La Habitación Tortuga — IA sin FOMO. Criterio sobre ruido.",
    template: "%s — La Habitación Tortuga",
  },
  description: "Espacio colectivo del equipo IA de ThePower Education. Laboratorios, casos prácticos y reflexiones honestas sobre inteligencia artificial. Despacio, con foco, con criterio.",
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
    siteName: "La Habitación Tortuga",
    title: "La Habitación Tortuga — IA sin FOMO. Criterio sobre ruido.",
    description: "Espacio colectivo del equipo IA de ThePower Education. Laboratorios, casos prácticos y reflexiones honestas sobre IA.",
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aRiveraMerida",
    creator: "@aRiveraMerida",
    title: "La Habitación Tortuga — IA sin FOMO.",
    description: "Espacio colectivo del equipo IA de ThePower Education. Despacio, con foco, con criterio.",
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
    description: 'Espacio colectivo del equipo IA de ThePower Education. Laboratorios, casos prácticos y reflexiones honestas sobre inteligencia artificial.',
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
        url: 'https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b',
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
      'https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b',
    ],
  };

  return (
    <html lang="es" className={`${inter.variable} ${jbmono.variable} ${playfair.variable} ${lora.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-paper text-ink overflow-x-hidden flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:bg-ink focus:text-paper focus:ed-ribbon-label"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
