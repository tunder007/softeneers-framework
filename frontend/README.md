# Frontend Quick Start

Frontend-ul este o aplicatie Next.js care consuma API-ul backend-ului (`/api/cars`)
si afiseaza demo-ul CRUD in pagina `masini`.

## 1) Instaleaza dependintele

```bash
cd frontend
npm install
```

## 2) Configureaza URL-ul backend-ului (optional, recomandat)

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
```

Daca nu ai `.env.local`, aplicatia foloseste implicit `http://localhost:4000`.

## 3) Porneste frontend-ul

```bash
npm run dev
```

Aplicatia ruleaza pe `http://localhost:3000`.

## 4) Pagini utile

- `http://localhost:3000/` - overview tehnologii monolith
- `http://localhost:3000/docs` - documentatie completa
- `http://localhost:3000/masini` - demo CRUD complet

## Important

Backend-ul trebuie sa fie pornit in paralel (`backend: npm run dev`) ca pagina
`/masini` sa poata face request-uri CRUD.
