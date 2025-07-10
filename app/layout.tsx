import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

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
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4837637014199282"
          async={true}
          crossOrigin="anonymous"
          data-nscript="afterInteractive" 
          data-checked-head="true"
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 