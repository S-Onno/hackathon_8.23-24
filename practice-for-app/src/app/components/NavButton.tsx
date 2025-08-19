import Link from "next/link";

type NavButtonProps = {
    href: string;
    children: React.ReactNode;
    className?: string; // 追加：ページ側で色やスタイルを渡せる
};

export default function NavButton({ href, children, className = "" }: NavButtonProps) {
    return (
        <Link href={href}>
            <button
                type="button"
                className={`px-6 py-2 rounded transform transition duration-200 hover:scale-125 ${className}`}
            >
                {children}
            </button>
        </Link>
    )
}
