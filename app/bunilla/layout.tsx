import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bunilla - Production builds in milliseconds",

  description: "Bunilla builds Next.js apps in less than a second.",

  applicationName: "Bunilla",
  authors: [{ name: "BestCodes", url: "https://bestcodes.dev" }],

  keywords: [
    "framework",
    "nextjs",
    "bunilla",
    "bun",
    "build",
    "production",
    "buildtime",
    "builds",
    "faster",
    "faster-than-before",
  ],

  creator: "BestCodes",
  publisher: "BestCodes",

  openGraph: {
    title: "Bunilla - Production builds in milliseconds",
    description: "Bunilla builds Next.js apps in less than a second.",
    url: "https://bestcodes.dev/bunilla?ref=og",
    siteName: "Bunilla",
    images: [],
  },

  alternates: {
    canonical: "https://old-site.bestcodes.dev/bunilla",
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
