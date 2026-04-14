import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// change the title and description according to the project
export const metadata: Metadata = {
    title: "Demo Repo",
    description: "Demo Repo by Softeneer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="h-full antialiased bg-white text-black dark:bg-black dark:text-white"
        >
            <body className="min-h-full flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
