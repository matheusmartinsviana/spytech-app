import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import ThemeProvider from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Login | SpyTech",
    description: "Faça login para acessar sua conta na SpyTech.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning={true}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="w-full h-screen flex justify-center items-center">
                        {children}
                    </div>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
