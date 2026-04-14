export default function Home() {
    return (
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
            <header className="space-y-3">
                <h1 className="text-4xl font-bold">Monolith Demo App</h1>
                <p className="text-zinc-700 dark:text-zinc-300">
                    Acesta este un demo full-stack foarte simplu pentru CRUD, facut ca
                    punct de pornire pentru invatare si pentru proiecte web mici.
                </p>
            </header>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Tehnologii folosite</h2>
                <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>
                        <strong>Next.js 16 + React 19 (frontend)</strong>: pentru pagini,
                        UI si navigare.
                    </li>
                    <li>
                        <strong>TypeScript</strong>: pentru tipuri clare si cod mai sigur.
                    </li>
                    <li>
                        <strong>Tailwind CSS</strong>: pentru styling rapid in componente.
                    </li>
                    <li>
                        <strong>Express</strong>: server HTTP simplu pentru API REST.
                    </li>
                    <li>
                        <strong>Sequelize + sequelize-cli</strong>: ORM + migration/seed.
                    </li>
                    <li>
                        <strong>MySQL + mysql2</strong>: baza de date relationala.
                    </li>
                </ul>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Cum este impartita aplicatia</h2>
                <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
                    <p>
                        <strong>Frontend (`frontend/app`)</strong>: afiseaza pagini, inclusiv
                        `masini`, unde rulezi operatiile CRUD din browser.
                    </p>
                    <p>
                        <strong>Backend (`backend`)</strong>: expune endpoint-uri API pentru
                        masini (`/api/cars`) si raspunde cu JSON.
                    </p>
                    <p>
                        <strong>Baza de date (MySQL)</strong>: pastreaza datele in tabela
                        `cars`, creata prin migration.
                    </p>
                </div>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">De ce fiecare tehnologie</h2>
                <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>
                        Next.js simplifica structura pe pagini si integrarea cu React.
                    </li>
                    <li>
                        Express tine backend-ul mic si usor de inteles pentru incepatori.
                    </li>
                    <li>
                        Sequelize permite CRUD fara SQL manual in majoritatea cazurilor.
                    </li>
                    <li>
                        Migration + seed fac setup-ul repetabil pe orice calculator.
                    </li>
                    <li>
                        CORS permite frontend-ului sa consume API-ul backend local.
                    </li>
                </ul>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Fluxul CRUD pe scurt</h2>
                <ol className="list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>Utilizatorul apasa Create/Read/Update/Delete in `frontend/app/masini/page.tsx`.</li>
                    <li>Frontend-ul face request catre `http://localhost:4000/api/cars`.</li>
                    <li>Route-ul din backend trimite request-ul in controller.</li>
                    <li>Controller-ul foloseste modelul Sequelize `Car`.</li>
                    <li>Modelul executa query in MySQL si backend-ul returneaza JSON.</li>
                </ol>
            </article>
        </section>
    );
}
