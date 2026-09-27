import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velaantra — Precision weeding shaped by Indian farms",
  description: "Velaantra is exploring compact mechanical weeding for Indian farms, beginning with farmer discovery and sunflower field validation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
