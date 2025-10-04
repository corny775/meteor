import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ColorblindWrapper from "../components/ui/ColorblindWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asteroid Impact Simulator - Defend Earth",
  description: "Interactive visualization and simulation platform for asteroid impact scenarios, deflection strategies, and planetary defense",
  keywords: ["asteroid", "impact", "simulation", "NASA", "planetary defense", "NEO"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ColorblindWrapper>
          {children}
        </ColorblindWrapper>
      </body>
    </html>
  );
}
