import { FAB } from "@/components/FAB";
import Navbar from "@/components/ui/navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppUserProvider } from "@/contexts";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "../assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900"
});
const geistMono = localFont({
    src: "../assets/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900"
});

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? process.env.NEXT_PUBLIC_APP_NAME
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <AppUserProvider>
                <html lang="en">
                    <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full pt-30`}>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            <Navbar />
                            {children}
                            <FAB />
                            <Toaster />
                        </ThemeProvider>
                    </body>
                </html>
            </AppUserProvider>
        </ClerkProvider>
    );
}
