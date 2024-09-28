import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "BestBible - Fetch, parse, and analyze the Bible easily with JavaScript | BestCodes",
  description:
    "The BestBible npm library is a free, open-source library for accessing Bible data. It has a simple and intuitive API, and is easily extensible.",
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
