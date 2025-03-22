import type { Metadata } from "next";
import localFont from "next/font/local";
import { Monitoring } from "react-scan/monitoring/next";
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
  title: "BestCodes' Website - Christian, Coder, Creator | Home",

  description:
    "BestCodes is a full-stack developer, christian and creator. This is BestCodes' Official Website.",

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
    "math",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Monitoring
          apiKey="AWmxfYKd6GJbhpEEBTXRyo9n3Cn9TlSr" // Safe to expose publically
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.GIT_COMMIT_HASH}
          branch={process.env.GIT_BRANCH}
        />
        {children}
      </body>
    </html>
  );
}
