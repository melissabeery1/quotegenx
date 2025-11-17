import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "QuoteGenX - AI Quote Image Generator",
  description: "Transform quotes into scroll-stopping graphics in seconds. A professional tool for coaches, influencers, and content creators to generate stunning, shareable quote images with AI-powered design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* The Google Fonts link from index.html is now handled by next/font, but we keep the preconnect hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Anton&family=Bebas+Neue&family=Bodoni+Moda:wght@400;700;900&family=Caveat:wght@400;700&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:wght@400;600;700&family=Dancing+Script:wght@400;700&family=Fraunces:wght@400;700;900&family=Great+Vibes&family=Josefin+Sans:wght@300;400;600;700&family=League+Spartan:wght@400;700;900&family=Libre+Baskerville:wght@400;700&family=Lobster&family=Lora:wght@400;700&family=Merriweather:wght@400;700;900&family=Montserrat:wght@300;400;600;700&family=Oswald:wght@300;400;700&family=Pacifico&family=Playfair+Display:wght@400;700;900&family=Prata&family=Raleway:wght@400;700&family=Righteous&family=Satisfy&family=Special+Elite&family=Syne:wght@400;700;800&family=Unica+One&family=Yeseva+One&display=swap" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
