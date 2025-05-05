import type { Metadata } from "next";
import localFont from "next/font/local";
import { Monitoring } from "react-scan/monitoring/next";
import "./globals.css";
import Script from "next/script";

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
        <Script
          defer
          data-domain="old-site.bestcodes.dev"
          src="https://webtracker.avikmukherjee.tech/tracking-script.js"
        />
        <div className="w-full h-16 flex flex-row gap-1 text-xl justify-center items-center fixed bottom-0 left-0 bg-yellow-500 opacity-75 hover:opacity-90 z-50">
          This site has moved to{" "}
          <a className="text-blue-500 underline" href="https://bestcodes.dev">
            bestcodes.dev
          </a>
          .
        </div>
        {children}
      </body>
    </html>
  );
}
