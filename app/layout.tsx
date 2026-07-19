import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
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
        <CommandPalette />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar user={session?.user} />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {session && <Sidebar />}
            <main style={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
