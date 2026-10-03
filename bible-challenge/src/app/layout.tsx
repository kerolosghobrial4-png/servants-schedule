import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "Bible Challenge", template: "%s · Bible Challenge" },
  description: "Daily Bible study competition",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
