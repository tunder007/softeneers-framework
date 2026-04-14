"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Car = {
    id: number;
    brand: string;
    model: string;
    year: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function MasiniPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState("Ready");
    const [isLoading, setIsLoading] = useState(false);

    const endpoint = useMemo(() => `${apiBaseUrl}/api/cars`, []);

    const loadCars = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoint, { cache: "no-store" });
            if (!response.ok) {
                throw new Error("Nu am putut incarca masinile.");
            }

            const data = (await response.json()) as Car[];
            setCars(data);
            setStatusMessage("Masinile au fost incarcate.");
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Eroare la incarcare.");
        } finally {
            setIsLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        void loadCars();
    }, [loadCars]);

    const resetForm = () => {
        setBrand("");
        setModel("");
        setYear("");
        setSelectedId(null);
    };

    const handleCreate = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brand, model, year: Number(year) }),
            });

            if (!response.ok) {
                throw new Error("Crearea masinii a esuat.");
            }

            setStatusMessage("Masina a fost adaugata.");
            resetForm();
            await loadCars();
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Eroare la creare.");
        }
    };

    const handleSelectCar = (car: Car) => {
        setSelectedId(car.id);
        setBrand(car.brand);
        setModel(car.model);
        setYear(String(car.year));
        setStatusMessage(`Masina #${car.id} este selectata pentru editare.`);
    };

    const handleUpdate = async () => {
        if (!selectedId) {
            setStatusMessage("Selecteaza o masina din tabel pentru update.");
            return;
        }

        try {
            const response = await fetch(`${endpoint}/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brand, model, year: Number(year) }),
            });

            if (!response.ok) {
                throw new Error("Actualizarea masinii a esuat.");
            }

            setStatusMessage(`Masina #${selectedId} a fost actualizata.`);
            resetForm();
            await loadCars();
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Eroare la update.");
        }
    };

    const handleDelete = async (carId: number) => {
        try {
            const response = await fetch(`${endpoint}/${carId}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Stergerea masinii a esuat.");
            }

            setStatusMessage(`Masina #${carId} a fost stearsa.`);
            if (selectedId === carId) {
                resetForm();
            }
            await loadCars();
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Eroare la stergere.");
        }
    };

    const handleReadOne = async () => {
        if (!selectedId) {
            setStatusMessage("Selecteaza o masina pentru GET by id.");
            return;
        }

        try {
            const response = await fetch(`${endpoint}/${selectedId}`);
            if (!response.ok) {
                throw new Error("Nu am gasit masina selectata.");
            }

            const car = (await response.json()) as Car;
            setStatusMessage(
                `GET by id: #${car.id} ${car.brand} ${car.model} (${car.year})`
            );
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Eroare la get by id.");
        }
    };

    return (
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
            <h1 className="text-3xl font-bold">CRUD Masini</h1>

            <p className="rounded-md border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700">
                Status: {isLoading ? "Loading..." : statusMessage}
            </p>

            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <input
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    placeholder="Brand"
                    className="rounded-md border border-zinc-300 px-3 py-2"
                    required
                />
                <input
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    placeholder="Model"
                    className="rounded-md border border-zinc-300 px-3 py-2"
                    required
                />
                <input
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    placeholder="An"
                    type="number"
                    className="rounded-md border border-zinc-300 px-3 py-2"
                    required
                />
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Create
                </button>
            </form>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleReadOne}
                    className="rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
                >
                    Read one
                </button>
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                    Update selected
                </button>
                <button
                    type="button"
                    onClick={loadCars}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    Refresh (Read all)
                </button>
                <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md bg-zinc-500 px-4 py-2 text-white hover:bg-zinc-600"
                >
                    Clear selection
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-zinc-300 text-left text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                            <th className="border border-zinc-300 px-3 py-2">ID</th>
                            <th className="border border-zinc-300 px-3 py-2">Brand</th>
                            <th className="border border-zinc-300 px-3 py-2">Model</th>
                            <th className="border border-zinc-300 px-3 py-2">Year</th>
                            <th className="border border-zinc-300 px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr
                                key={car.id}
                                className={selectedId === car.id ? "bg-yellow-100 text-black" : ""}
                            >
                                <td className="border border-zinc-300 px-3 py-2">{car.id}</td>
                                <td className="border border-zinc-300 px-3 py-2">{car.brand}</td>
                                <td className="border border-zinc-300 px-3 py-2">{car.model}</td>
                                <td className="border border-zinc-300 px-3 py-2">{car.year}</td>
                                <td className="border border-zinc-300 px-3 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectCar(car)}
                                            className="rounded bg-amber-500 px-2 py-1 text-white hover:bg-amber-600"
                                        >
                                            Select
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(car.id)}
                                            className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {cars.length === 0 && (
                            <tr>
                                <td className="border border-zinc-300 px-3 py-2" colSpan={5}>
                                    Nu exista masini in baza de date.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
