// src/components/NavigationBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { label: 'My Page', href: '/mypage' },
  { label: '学習', href: '/study' },
  { label: 'フレンド', href: '/friends' },
  { label: '単語帳', href: '/word-list' },
];

export default function NavigationBar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center fixed top-0 left-0 right-0 z-50">
      {/* ロゴを左上に配置 */}
      <div className="flex-1 flex justify-start">
        <Link href="/top">
          <Image
            src="/_images/Universelogobutton.png" // 画像のパスを指定
            alt="Universe Logo"
            width={120} // 画像の幅を調整
            height={40} // 画像の高さを調整
          />
        </Link>
      </div>
      {/* ナビゲーションリンクを中央に配置 */}
      <div className="flex-1 flex justify-center gap-6">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <span className="text-gray-800 hover:text-blue-500 font-semibold cursor-pointer">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      
      {/* 右側のスペースを確保 */}
      <div className="flex-1"></div>
    </nav>
  );
}