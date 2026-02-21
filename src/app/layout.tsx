import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolySwipe — Discover Prediction Markets",
  description: "Browse and discover Polymarket prediction markets in a fast, scrollable feed.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#131722",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bg-primary)] overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
