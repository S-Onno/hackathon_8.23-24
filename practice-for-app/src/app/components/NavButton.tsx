import Link from "next/link";

type NavButtonProps = {
    href: string;
    children: React.ReactNode;
    className?: string; // 追加：ページ側で色やスタイルを渡せる
};

export default function NavButton({ href, children, className = "" }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded px-6 py-2 transition duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}
