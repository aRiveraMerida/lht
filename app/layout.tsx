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
    default: "La Habitación Tortuga [LHT] | Blog sobre IA y Tutoriales",
    template: "%s | La Habitación Tortuga [LHT]",
  },
  description: "Un sitio donde leer sobre lo que importa y mueve la aguja. Blog sobre inteligencia artificial y tutoriales prácticos. Por Alberto Rivera y David Dix.",
  keywords: [
    "la habitacion tortuga",
    "lht",
    "blog IA",
    "tutoriales IA",
    "inteligencia artificial",
    "IA",
    "tecnología",
    "tutoriales",
    "prompts",
    "machine learning",
    "alberto rivera",
    "david dix",
    "aprender IA",
  ],
  authors: [
    { name: "Alberto Rivera" },
    { name: "David Dix" },
  ],
  creator: "La Habitación Tortuga",
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
    title: "La Habitación Tortuga [LHT] - Blog sobre IA y Tutoriales",
    description: "Un sitio donde leer sobre lo que importa y mueve la aguja. Blog sobre inteligencia artificial y tutoriales prácticos.",
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga [LHT] - Conversaciones sin guión',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lahabitaciontortuga",
    creator: "@aRiveraMerida",
    title: "La Habitación Tortuga [LHT]",
    description: "Blog sobre inteligencia artificial y tutoriales prácticos. Por Alberto Rivera y David Dix.",
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
    description: 'Blog sobre inteligencia artificial y tutoriales prácticos. Por Alberto Rivera y David Dix',
    inLanguage: 'es-ES',
    author: [
      {
        '@type': 'Person',
        name: 'Alberto Rivera',
      },
      {
        '@type': 'Person',
        name: 'David Dix',
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
      'https://www.youtube.com/@LaHabitacionTortuga',
      'https://instagram.com/lahabitaciontortuga',
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
