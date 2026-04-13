import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/tiktok-sans/index.css";
import "@fontsource/tiktok-sans/400.css";
import "@fontsource/tiktok-sans/500.css";
import "@fontsource/tiktok-sans/600.css";
import "@fontsource/tiktok-sans/700.css";
import "@fontsource/tiktok-sans/800.css";
import "@fontsource/tiktok-sans/900.css";
import "./globals.css";

import { headers } from "next/headers";

import { IS_HEADLESS } from "@/lib/config";

export const metadata: Metadata = {
  title: IS_HEADLESS ? "TikTok Shop" : "ScaleShop - Alta Conversão TikTok Style",
  description: IS_HEADLESS 
    ? "Sua loja oficial no TikTok." 
    : "A infraestrutura definitiva para operações de escala agressiva no TikTok.",
  manifest: "/manifest.json",
  icons: {
    icon: IS_HEADLESS 
      ? [{ url: "/logo-do-tik-tok_578229-290.jpg", type: "image/jpeg" }]
      : [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/favicon.png", type: "image/png", sizes: "32x32" },
        ],
    apple: IS_HEADLESS
      ? [{ url: "/logo-do-tik-tok_578229-290.jpg", type: "image/jpeg" }]
      : [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

// FallbackMetadata para lojas será tratado via client-side components no modo estático
// ou via injeção de SEO no Netlify.

import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          {/* Microsoft Clarity */}
          <Script id="clarity-analytics" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vtqjnc4bf7");`}
          </Script>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
