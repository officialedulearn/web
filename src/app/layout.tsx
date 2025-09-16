import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import UserInitializer from "../components/UserInitializer";

const satoshi = localFont({src: '../../public/assets/fonts/Satoshi-Regular.otf', variable: '--font-satoshi'});

export const metadata: Metadata = {
  title: "EduLearn",
  description: "Incentivized AI study companion that makes web3 learning fun and rewarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${satoshi.className} antialiased`}
      >
        <UserInitializer />
        {children}
      </body>
    </html>
  );
}
