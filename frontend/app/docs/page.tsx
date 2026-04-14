export default function Docs() {
    return (
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
            <header className="space-y-3">
                <h1 className="text-4xl font-bold">Documentatie - Monolith CRUD Demo</h1>
                <p className="text-base text-zinc-700 dark:text-zinc-300">
                    Aceasta aplicatie este un exemplu super simplu de monolith web app:
                    frontend Next.js + backend Express + MySQL + Sequelize.
                </p>
                <p className="text-base text-zinc-700 dark:text-zinc-300">
                    Scopul ei este dublu: suport educational pentru juniori si punct de
                    pornire pentru proiecte mici care au nevoie de CRUD rapid.
                </p>
            </header>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Ce demonstreaza aplicatia</h2>
                <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>Arhitectura monolitica simpla (un frontend + un backend).</li>
                    <li>Flux complet CRUD pentru resursa `cars` (masini).</li>
                    <li>Separare clara pe layere: rute, controller, model, baza de date.</li>
                    <li>Migrare si seed pentru popularea initiala a bazei de date.</li>
                    <li>Conectare frontend-backend prin API REST si CORS.</li>
                </ul>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Flux CRUD (cap-coada)</h2>
                <ol className="list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>
                        Utilizatorul deschide pagina <code>/masini</code> si apasa butoane CRUD.
                    </li>
                    <li>
                        Frontend-ul trimite request-uri la backend:{" "}
                        <code>GET/POST/PUT/DELETE /api/cars</code>.
                    </li>
                    <li>
                        Router-ul backend directioneaza request-ul catre controller-ul potrivit.
                    </li>
                    <li>
                        Controller-ul valideaza input-ul si foloseste modelul Sequelize <code>Car</code>.
                    </li>
                    <li>
                        Modelul executa query-uri in MySQL pe tabela <code>cars</code>.
                    </li>
                    <li>Backend-ul raspunde cu JSON, iar frontend-ul re-randeaza tabelul.</li>
                </ol>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Documentatie backend pe fisiere</h2>

                <div className="space-y-4">
                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/index.ts`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Punctul de intrare al serverului. Configureaza CORS si JSON parser,
                            adauga endpoint-ul de health-check, inregistreaza rutele CRUD si
                            porneste serverul doar dupa conexiunea reusita la MySQL.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/routes/carRoutes.ts`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Defineste endpoint-urile REST pentru masini:
                            <code> GET /</code>, <code>GET /:id</code>, <code>POST /</code>,{" "}
                            <code>PUT /:id</code>, <code>DELETE /:id</code>.
                            Este stratul de routing.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/controller/carController.ts`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Contine logica CRUD efectiva. Aici se face validarea simpla a
                            datelor, cautarea dupa id, crearea, actualizarea si stergerea
                            inregistrarilor din tabela `cars`.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/models/car.ts`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Defineste modelul Sequelize `Car` (campurile tabelului) si conexiunea
                            la MySQL folosind setarile din `config/config.cjs`.
                            Acesta este stratul care vorbeste direct cu baza de date.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/config/config.cjs`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Configurarea centrala a DB pentru medii (`development`, `test`,
                            `production`) citita din variabile de mediu. Este folosita de
                            `sequelize-cli` la comenzi de migrate/seed.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">
                            `backend/migrations/20260414160000-create-cars-table.js`
                        </p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Creeaza tabela `cars` cu structura corecta (`id`, `brand`, `model`,
                            `year`, `createdAt`, `updatedAt`). Functia `down` sterge tabela.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">
                            `backend/seeders/20260414160500-seed-cars.js`
                        </p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Introduce date initiale in tabela `cars` (exemple de masini) pentru
                            demo rapid. Functia `down` sterge datele inserate.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/.env.example`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Contin variabilele de mediu necesare: port backend, URL frontend,
                            host/user/parola/nume DB pentru MySQL.
                        </p>
                    </div>

                    <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="font-semibold">`backend/package.json`</p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Lista de dependinte si script-uri utile:
                            <code> dev</code>, <code>build</code>, <code>db:migrate</code>,{" "}
                            <code>db:seed</code>, <code>db:reset</code>.
                        </p>
                    </div>
                </div>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Comenzi utile pentru demo</h2>
                <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                    <p>
                        1. In backend: <code>npm run db:migrate</code>
                    </p>
                    <p>
                        2. In backend: <code>npm run db:seed</code>
                    </p>
                    <p>
                        3. In backend: <code>npm run dev</code>
                    </p>
                    <p>
                        4. In frontend: <code>npm run dev</code>
                    </p>
                    <p>
                        5. Deschizi <code>/masini</code> si testezi create, read, update, delete.
                    </p>
                </div>
            </article>

            <article className="space-y-4 rounded-lg border border-zinc-200 p-5 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold">Pentru cine este acest demo</h2>
                <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                    <li>Juniori care invata primul flux CRUD full-stack.</li>
                    <li>Echipe mici care vor un boilerplate monolitic simplu.</li>
                    <li>Proiecte web mici/medii unde viteza de livrare este importanta.</li>
                </ul>
            </article>
        </section>
    );
}
