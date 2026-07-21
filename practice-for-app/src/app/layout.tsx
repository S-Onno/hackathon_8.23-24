import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universe",
  description: "学習時間と単語カードを記録し、学びを可視化するアプリ",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
