import './globals.css';
import type { Metadata, Viewport } from 'next';

// 添加 viewport 配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: '在线画板 - 免费简单的绘画工具',
  description: '一个简单易用的在线画板应用，支持自由绘画、橡皮擦、撤销重做等功能。无需安装，打开即用的网页绘画工具。',
  keywords: '在线画板, 网页画板, 绘画工具, 在线绘画, 免费画板, 在线绘画工具, 在线画图, 在线绘画软件, 在线画图工具, 在线画图软件, 在线画图工具, 在线画图软件, 涂鸦, 白板, 黑板, 写字板, 少儿绘画, 少儿涂鸦',
  authors: [{ name: '在线画板' }],
  metadataBase: new URL('https://whiteboard.zhangxinxu.com'),
  openGraph: {
    title: '在线画板 - 免费简单的绘画工具',
    description: '一个简单易用的在线画板应用，支持自由绘画、橡皮擦、撤销重做等功能。',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
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