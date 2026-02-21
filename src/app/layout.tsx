import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolySwipe — Swipe the Markets",
  description: "TikTok meets Polymarket. Swipe right to bet YES, left to pass. Discover prediction markets like never before.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
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
