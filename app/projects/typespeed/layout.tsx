import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Free typing speed test - Customizable, intuitive, and high-accuracy | BestCodes",
  description:
    "Easily measure your typing speed and accuracy with our free typing speed test. It's easy to use and provides detailed results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
