import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Orbitron, Noto_Sans_SC } from "next/font/google";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { GridBackground } from "@/components/cyber/GridBackground";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "时寂 — 科幻小说读者讨论区",
  description:
    "《时寂》读者讨论论坛：量子意识、灵魂数据化与伦理困境的硬科幻创作交流空间",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${notoSansSC.variable}`}>
      <body className="antialiased">
        <GridBackground />
        <Header user={session?.user} />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-cyan-500/10 py-8 mt-16">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
            <p className="font-orbitron text-cyan-500/60 text-xs tracking-widest mb-2">
              SHIJI · 时寂
            </p>
            <p>科幻小说读者讨论论坛 · 与未来对话</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
