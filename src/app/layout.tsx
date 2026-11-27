import type { Metadata } from "next";
import { Open_Sans, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAIMIF - Central Analytical Instrumentation & Microscopy Facility",
  description:
    "State-of-the-art analytical instrumentation and microscopy facility at Sharda University.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Global application navigation bar */}
        <Navbar />
        {/* Main page content */}
        <main className="flex-1 flex flex-col">{children}</main>
        {/* Global public footer (suppressed on admin & auth routes) */}
        <Footer />
      </body>
    </html>
  );
}
