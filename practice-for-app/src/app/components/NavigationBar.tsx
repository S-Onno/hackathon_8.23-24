// src/components/NavigationBar.tsx
'use client';

import Link from 'next/link';

const navItems = [
  { label: 'My Page', href: '/mypage' },
  { label: '学習', href: '/study' },
  { label: 'フレンド', href: '/friends' },
];

export default function NavigationBar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex gap-6 justify-center fixed top-0 left-0 right-0 z-50">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href}>
          <span className="text-gray-800 hover:text-blue-500 font-semibold cursor-pointer">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}