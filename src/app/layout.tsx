import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scouteon | Platform Rekrutmen Pelaut",
  description:
    "Menghubungkan pelaut (seafarer) dengan perusahaan pelayaran secara cepat dan transparan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
