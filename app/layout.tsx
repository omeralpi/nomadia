// import { ErudaProvider } from "@/components/eruda";
import MiniKitProvider from "@/components/providers/minikit-provider";
import NextAuthProvider from "@/components/providers/next-auth-provider";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn(inter.className, spaceGrotesk.variable, "antialiased dark relative")}>
        <div className="fixed top-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full bg-primary/40 blur-[100px] pointer-events-none z-10" aria-hidden="true" />
        <div className="fixed bottom-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full bg-primary/40 blur-[100px] pointer-events-none z-10" aria-hidden="true" />
        <NextAuthProvider>
          <TRPCProvider>
            {/* <ErudaProvider> */}
            <MiniKitProvider>
              {children}
            </MiniKitProvider>
            {/* </ErudaProvider> */}
          </TRPCProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
