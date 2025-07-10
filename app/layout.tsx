import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线画板',
  description: '一个简单的在线画板应用',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4837637014199282"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 