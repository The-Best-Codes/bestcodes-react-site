import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Thank You for 20K Dev.to Followers! | BestCodes",
  description: "A special thank you page celebrating 20,000 followers on Dev.to",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning className={`${geistSans.variable} font-sans`}>
      {children}
    </div>
  );
}
