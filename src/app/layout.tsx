import { Toaster } from "@/shared/components/ui/sonner";
import Providers from "@/shared/providers/providers";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Exam App",
  description: "An app for taking exams online",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${geistMono.className} ${inter.variable} antialiased`}>
        <Providers>
          <main className="h-screen">
            {children}
            <Toaster toastOptions={{ style: { backgroundColor: 'rgba(31, 41, 55, 1)', color: 'white', fontSize: '14px', fontWeight: '500', gap: '10px', padding: '16px', borderRadius: '0' } }} icons={{ success: <Check className='text-green-500' /> }} />
          </main>
        </Providers>
      </body>
    </html>
  );
}
