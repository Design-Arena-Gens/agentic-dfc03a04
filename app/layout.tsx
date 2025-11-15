import type { Metadata } from "next";
import { Creepster, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster"
});

export const metadata: Metadata = {
  title: "AI Horror Stories - Generate Terrifying Tales",
  description: "Create spine-chilling horror stories with AI-generated narratives, deep voice narration, and horror effects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${creepster.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
