import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import AnimatedBackground from "@/components/AnimatedBackground";
import { AuthProvider } from "@/lib/useAuth";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finding Finance Association",
  description: "Learn financial literacy with Finding Finance Association",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/ffa-logo.png" type="image/svg+xml" />
      </head>
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />{/* <AnimatedBackground /> */}
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
