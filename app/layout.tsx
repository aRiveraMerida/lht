import type { Metadata } from "next";
import { JetBrains_Mono, Saira_Extra_Condensed, Sofia_Sans_Extra_Condensed } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const saira = Saira_Extra_Condensed({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
  weight: ["100", "300", "500", "700", "800", "900"],
});

const sofia = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  variable: "--font-sofia",
  display: "swap",
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lahabitaciontortuga.com'),
  title: {
    default: "La Habitación Tortuga — La IA, despacio.",
    template: "%s — La Habitación Tortuga",
  },
  description: "Laboratorio de IA sin prisas. Probamos antes de opinar. Sin humo, sin FOMO. Un sitio del equipo de IA de The Power Education.",
  keywords: [
    "la habitacion tortuga",
    "lht",
    "laboratorio IA",
    "IA sin prisas",
    "IA sin FOMO",
    "adopción inteligencia artificial",
    "probar antes de opinar",
    "claude code",
    "the power education",
    "equipo IA the power",
  ],
  authors: [
    { name: "Equipo de IA de The Power Education" },
  ],
  creator: "Equipo de IA de The Power Education",
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
    title: "La Habitación Tortuga — La IA, despacio.",
    description: "Laboratorio de IA sin prisas. Probamos antes de opinar. Sin humo, sin FOMO.",
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
    title: "La Habitación Tortuga — La IA, despacio.",
    description: "Laboratorio de IA sin prisas. Probamos antes de opinar.",
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
    description: 'Laboratorio de IA sin prisas. Probamos antes de opinar. Un sitio del equipo de IA de The Power Education.',
    inLanguage: 'es-ES',
    author: {
      '@type': 'Organization',
      name: 'Equipo de IA de The Power Education',
    },
    publisher: {
      '@type': 'Organization',
      name: 'La Habitación Tortuga',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lahabitaciontortuga.com/favicon.svg',
      },
    },
  };

  return (
    <html
      lang="es"
      className={`${jbmono.variable} ${saira.variable} ${sofia.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-paper text-ink overflow-x-hidden flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-5 focus:py-3 focus:bg-ink focus:text-paper focus:ed-ribbon-label"
        >
          Saltar al contenido principal
        </a>

        {/* Global overlays */}
        <div className="lht-red-strip" aria-hidden="true" />
        <div className="lht-grid-lines" aria-hidden="true" />
        <div className="lht-noise" aria-hidden="true" />

        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
