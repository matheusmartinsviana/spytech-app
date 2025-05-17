import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpyTech | Inteligência Artificial para Análise de Concorrência",
  description: "A SpyTech utiliza tecnologia de ponta em IA para analisar e oferecer insights estratégicos sobre seus concorrentes, ajudando sua empresa a tomar decisões mais inteligentes e rápidas.",
  icons: {
    icon: "https://spytech.mgtechbr.com/icons/favicon.ico",
    shortcut: "https://spytech.mgtechbr.com/icons/favicon.ico",
    apple: "https://spytech.mgtechbr.com/icons/favicon.ico",
  },
  openGraph: {
    title: "SpyTech | Inteligência Artificial para Análise de Concorrência",
    description: "A SpyTech utiliza tecnologia de ponta em IA para analisar e oferecer insights estratégicos sobre seus concorrentes, ajudando sua empresa a tomar decisões mais inteligentes e rápidas.",
    url: "https://spytech.mgtechbr.com",
    siteName: "SpyTech",
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="w-full h-screen overflow-hidden flex flex-col">
              {children}
            </main>
          </ThemeProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
