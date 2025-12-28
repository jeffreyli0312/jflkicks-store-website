import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Banner from "./components/Banner";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JLFKicks",
    template: "%s | JLFKicks",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Banner />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
