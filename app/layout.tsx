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
  metadataBase: new URL('https://lahabitaciontortuga.com'),
  title: {
    default: "La Habitación Tortuga [LHT] | Reflexiones sobre IA, Estrategia y Adopción",
    template: "%s | La Habitación Tortuga [LHT]",
  },
  description: "Un espacio para pensar despacio sobre inteligencia artificial. Estrategia, adopción, miedos, decisiones y experiencia real. Por Alberto Rivera.",
  keywords: [
    "la habitacion tortuga",
    "lht",
    "blog IA reflexivo",
    "estrategia IA",
    "adopción inteligencia artificial",
    "reflexiones IA",
    "decisiones IA",
    "inteligencia artificial",
    "IA empresas",
    "transformación digital",
    "experiencia IA",
    "alberto rivera",
    "futuro IA",
    "incertidumbre IA",
    "pensar sobre IA",
  ],
  authors: [
    { name: "Alberto Rivera" },
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
    title: "La Habitación Tortuga [LHT] - Reflexiones sobre IA, Estrategia y Adopción",
    description: "Un espacio para pensar despacio sobre inteligencia artificial. Estrategia, adopción, miedos, decisiones y experiencia real.",
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga [LHT] - Pensar despacio sobre lo que va demasiado rápido',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aRiveraMerida",
    creator: "@aRiveraMerida",
    title: "La Habitación Tortuga [LHT]",
    description: "Un espacio para pensar despacio sobre inteligencia artificial. Estrategia, adopción y experiencia real. Por Alberto Rivera.",
    images: ['/favicon.svg'],
  },
  alternates: {
    canonical: "https://lahabitaciontortuga.com",
  },
  verification: {
    google: 'google-site-verification-code', // Reemplazar con código real después de registrar en Google Search Console
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
    description: 'Un espacio para pensar despacio sobre inteligencia artificial. Estrategia, adopción, miedos, decisiones y experiencia real. Por Alberto Rivera.',
    inLanguage: 'es-ES',
    author: {
      '@type': 'Person',
      name: 'Alberto Rivera',
      url: 'https://www.linkedin.com/in/albertoriveramerida',
    },
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
