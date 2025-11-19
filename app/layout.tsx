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
    default: "La Habitación Tortuga [LHT] | Canal de YouTube y Podcast",
    template: "%s | La Habitación Tortuga [LHT]",
  },
  description: "Bienvenido a la habitación donde hablamos de lo que vivimos. Canal de YouTube donde Alberto y David charlan sobre tecnología, IA, proyectos y vida. Sin guión, sin filtros, sin postureo. Conversaciones reales desde la habitación.",
  keywords: [
    "la habitacion tortuga",
    "lht",
    "youtube español",
    "podcast español",
    "conversaciones",
    "inteligencia artificial",
    "IA",
    "tecnología",
    "emprendimiento",
    "proyectos",
    "desarrollo personal",
    "alberto rivera",
    "david",
    "charlas sin guión",
    "aprender en público",
  ],
  authors: [
    { name: "Alberto Rivera" },
    { name: "David" },
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://lahabitaciontortuga.com",
    siteName: "La Habitación Tortuga [LHT]",
    title: "La Habitación Tortuga [LHT] - Conversaciones sin guión",
    description: "Un canal de YouTube donde pasan cosas. Conversaciones reales sobre tecnología, IA, proyectos y vida. Sin guión, sin filtros, sin postureo.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'La Habitación Tortuga [LHT] - Conversaciones sin guión',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lahabitaciontortuga",
    creator: "@aRiveraMerida",
    title: "La Habitación Tortuga [LHT]",
    description: "Canal de YouTube y podcast. Conversaciones sin guión desde la habitación sobre tecnología, IA y proyectos.",
    images: ['/og-image.png'],
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
    description: 'Canal de YouTube y podcast con conversaciones sin guión sobre tecnología, IA, proyectos y vida',
    inLanguage: 'es-ES',
    author: [
      {
        '@type': 'Person',
        name: 'Alberto Rivera',
      },
      {
        '@type': 'Person',
        name: 'David',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'La Habitación Tortuga',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lahabitaciontortuga.com/og-image.png',
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
