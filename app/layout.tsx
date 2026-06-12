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
  title: "SHIJI — 科幻小说讨论区",
  description:
    "一个赛博朋克风格的科幻小说读者讨论论坛，分享你对小说创作的建议与想法",
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
              SHIJI PROJECT
            </p>
            <p>科幻小说讨论论坛 · 读者共创未来</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
