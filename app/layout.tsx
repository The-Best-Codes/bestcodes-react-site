import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BestCodes' Legacy Website",

  description:
    "The legacy website of BestCodes, a full-stack developer, christian and creator. This site contains old projects and resources.",

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
    "math",
  ],

  creator: "BestCodes",
  publisher: "BestCodes",

  openGraph: {
    title: "BestCodes' Legacy Website",
    description:
      "The legacy website of BestCodes, a full-stack developer, christian and creator. This site contains old projects and resources.",
    url: "https://old-site.bestcodes.dev",
    siteName: "BestCodes' Legacy Website",
    images: [
      {
        url: "https://old-site.bestcodes.dev/image/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  alternates: {
    canonical: "https://old-site.bestcodes.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
