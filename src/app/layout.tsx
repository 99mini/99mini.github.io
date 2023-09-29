import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../containers/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "0mini.dev",
  description: "0mini dev blog | github page develop blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
