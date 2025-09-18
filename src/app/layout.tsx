import type { Metadata } from "next";
import {  Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jethings Admin",
  description: "Jethings Admin pour gérer Jethings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${montserrat.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>
        {children}
        </Providers>
     
      </body>
    </html>
  );
}
