import Link from "next/link";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Masini", href: "/masini" },
    { label: "Docs", href: "/docs" },
];

const Navbar = () => {
    return (
        <header className="border-b border-zinc-200 bg-zinc-50 font-sans dark:border-zinc-800 dark:bg-black">
            <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold tracking-tight">
                    Demo Repo
                </Link>

                <ul className="flex items-center gap-6 text-sm">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;