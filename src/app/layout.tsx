import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "@/components/layout/providers";
import { Toaster } from "sonner";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className={`min-h-full flex flex-col `}>
       
        <Providers> {children}</Providers>
         <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
