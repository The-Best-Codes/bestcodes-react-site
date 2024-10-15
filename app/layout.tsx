import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BestCodes' Website - Christian, Coder, Creator | Home",
  description: "BestCodes' Official Website | Christian, Coder, Creator",
  applicationName: "BestCodes' Website",
  authors: [{ name: "BestCodes", url: "https://bestcodes.dev" }],
  keywords: [
    "BestCodes",
    "The-Best-Codes",
    "Christian",
    "coder",
    "creator",
    "free",
    "javascript",
    "projects",
    "codequill",
    "best-bible",
    "best-holiday",
  ],
  creator: "BestCodes",
  publisher: "BestCodes",
  openGraph: {
    title: "BestCodes' Website - Christian, Coder, Creator | Home",
    description: "BestCodes' Official Website | Christian, Coder, Creator",
    url: "https://bestcodes.dev",
    siteName: "BestCodes' Website",
    images: [
      {
        url: "https://bestcodes.dev/image/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      {/* <GoogleAnalytics gaId="" /> */}
    </html>
  );
}
