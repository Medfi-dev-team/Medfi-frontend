import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/LandingPage/Header";
import {Providers} from "./providers";
import Footer from "@/components/LandingPage/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedFi - Decentralized Healthcare Platform", 
  description: "MedFi is a blockchain-powered healthcare platform connecting patients with verified medical professionals. Book appointments, manage medical records securely, and experience transparent healthcare services.", 
  keywords: "healthcare, blockchain, medical appointments, doctors, patients, medical records, decentralized health, telemedicine, USDC payments",
   authors: [{ name: "MedFi Team" }], 
   creator: "MedFi",
    publisher: "MedFi",
    icons: {
    icon: "/logo.png", // make sure this file exists in your public folder
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MedFi - Decentralized Healthcare Platform",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MedFi - Decentralized Healthcare Platform",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
