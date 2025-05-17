import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import ThemeProvider from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProfile } from "@/components/common/user-profile";
import { ensureCompanyProfileCompleted } from "@/lib/auth/ensure-company-profile";

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
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureCompanyProfileCompleted();

  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="w-full h-screen overflow-hidden flex flex-col">
              <UserProfile />
              {children}
            </main>
          </ThemeProvider>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
