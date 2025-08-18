import Link from "next/link";

type NavButton = {
    href: string;
    children: React.ReactNode;
};

export default function NavButton({ href, children}: NavButton) {
    return (
        <Link href={href}>
            <button className="px-6 py-2 bg-gray-350 rounded hover:bg-gray-700 transition">
                {children}
            </button>
        </Link>
    )
}
