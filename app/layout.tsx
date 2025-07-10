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
      <body>{children}</body>
    </html>
  );
} 