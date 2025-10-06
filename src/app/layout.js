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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://medfi.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: "MedFi - Decentralized Healthcare Platform",
    description: "Book appointments with verified doctors, manage your medical records securely, and experience transparent healthcare powered by blockchain technology.",
    url: 'https://medfi.com',
    siteName: 'MedFi',
    images: [
      {
        url: '/logo.png', // You should create this image
        width: 1200,
        height: 630,
        alt: 'MedFi - Decentralized Healthcare Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MedFi - Decentralized Healthcare Platform",
    description: "Experience secure, transparent healthcare with blockchain technology. Book appointments with verified doctors and manage your medical records.",
    images: ['/twitter-image.jpg'], // You should create this image
    creator: '@medfiofficial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add when you have it
    yandex: 'your-yandex-verification-code', // Add when you have it
    yahoo: 'your-yahoo-verification-code', // Add when you have it
  },
  category: 'healthcare',
}

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
