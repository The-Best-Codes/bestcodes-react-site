import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "CodePerf - Measure and optimize your code performance | BestCodes",

  description:
    "CodePerf gives you detailed insights on the speed of your codes, making it easy to optimize them as needed.",
  alternates: {
    canonical: "https://old-site.bestcodes.dev/projects/codeperf",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
