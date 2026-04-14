const Footer = () => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date());

    return (
        <footer className="border-t ">
            <div className="mx-auto flex w-full items-center justify-between px-6 py-4 text-sm">
                <p>© {currentYear} Demo Repo</p>
                <p>Updated {currentDate}</p>
            </div>
        </footer>
    );
};

export default Footer;