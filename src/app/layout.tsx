import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Team Trivia",
  description: "A 2-team trivia game for phones, tablets and big screens.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Trivia", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#14123a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" data-theme="dark"><body>{children}</body></html>);
}
