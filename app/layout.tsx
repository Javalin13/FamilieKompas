import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilieKompas",
  description: "Een rustige eerste stap voor ouders en gezinnen in Vlaanderen."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
