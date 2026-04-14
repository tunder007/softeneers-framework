# Backend Quick Start

Backend-ul este un API Express + Sequelize + MySQL pentru CRUD pe `cars`.

## 1) Instaleaza dependintele

```bash
cd backend
npm install
```

## 2) Creeaza baza de date MySQL (generic CLI)

Inlocuieste placeholder-ele cu valorile tale:

```bash
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p -e "CREATE DATABASE IF NOT EXISTS monolith_demo_dev;"
```

Exemplu uzual local:

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p -e "CREATE DATABASE IF NOT EXISTS monolith_demo_dev;"
```

## 3) Configureaza `.env` din `.env.example`

```bash
cp .env.example .env
```

Editeaza apoi `./.env` cu datele tale reale de conexiune MySQL.

## 4) Ruleaza migration + seed

```bash
npm run db:migrate
npm run db:seed
```

Migration creeaza tabela `cars`, seed adauga date demo.

## 5) Porneste serverul backend

```bash
npm run dev
```

Serverul ruleaza pe `http://localhost:4000`.

## 6) Verifica rapid API-ul

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/cars
```

## Comenzi utile

```bash
npm run db:reset
npm run build
npm run start
```
