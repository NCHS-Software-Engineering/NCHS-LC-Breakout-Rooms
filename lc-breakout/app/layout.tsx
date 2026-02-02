import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: '400',
  subsets: ['latin'],
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ['latin'],
  display: 'swap',
});


export const metadata: Metadata = {
  title: "NCHS LC Breakout Room",
  description: "Sign up for LC Breakout Rooms at NCHS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistMono.variable} antialiased !bg-[#fefefe] dark:!bg-black`}
      >
        
          <Navbar />
          {children}
        
        
      </body>
    </html>
  );
}
