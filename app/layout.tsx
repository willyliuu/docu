import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { HelpModalClient } from "@/components/HelpModalClient";
import { Toaster } from "sonner";
import { auth } from "@/auth";


export const metadata: Metadata = {
  title: "Docu - Knowledge Base",
  description: "Write it once. Find it forever.",
};

import { GeistSans } from 'geist/font/sans';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jb-mono' });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${GeistSans.variable} ${inter.variable} ${jbMono.variable}`}>
      <body>
        <Toaster theme="dark" position="bottom-right" richColors />
        <CommandPalette />
        <HelpModalClient />
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {session && <Sidebar />}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {session && <Navbar user={session.user} />}
            <main style={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
