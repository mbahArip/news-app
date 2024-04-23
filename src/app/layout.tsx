import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextjsTopLoader from "nextjs-toploader";
import { Toaster } from "~/components/ui/toaster";
import newsAPI from "~/lib/news";
import { cn } from "~/lib/utils";
import LoadingStopper from "./LoadingStopper.client";
import ToTop from "./ToTop.client";
import Footer from "./global/Footer";
import Navbar from "./global/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beritaku",
  description: "Platform berita",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sumber = await newsAPI.getSources();
  if (sumber.status === "error") {
    throw new Error(sumber.message);
  }

  return (
    <html lang="en">
      <body className={cn(inter.className, "w-full min-h-screen flex flex-col")}>
        <NextjsTopLoader showSpinner={false} />
        <LoadingStopper />
        <Navbar />
        <main className="w-full flex-grow">{children}</main>
        <ToTop />
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
