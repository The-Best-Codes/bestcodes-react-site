import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BestCodes' Website - Christian, Coder, Creator | Home",
  description: "BestCodes' Official Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      {/* <GoogleAnalytics gaId="G-0KLZV1DQKW" /> */}
    </html>
  );
}
