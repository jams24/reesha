# Reesha Wears & Thrift

Minimal-luxury e-commerce site for **Reesha Wears and Thrift** — a thrift & imported clothing shop based in Osogbo, Osun State, Nigeria.

- **Checkout**: Pre-filled WhatsApp orders to `+2348161518807`
- **Frontend**: React + Vite + Tailwind
- **Backend**: Node/Express + PostgreSQL (Prisma ORM)
- **Image hosting**: Cloudinary
- **Admin**: Email/password login, product CRUD with image uploads

## Repo layout

```
reesha/
├── backend/        # Express + Prisma + Postgres (serves the frontend build in prod)
└── frontend/       # React + Vite + Tailwind
```

In production the Express server also serves `frontend/dist/*`, so **one deployment** covers both API and storefront.

---

## 1. Local setup

### Prerequisites
- Node 18+
- PostgreSQL running locally (or a cloud Postgres URL)
- A Cloudinary account ([free tier](https://cloudinary.com))

### Backend
```bash
cd backend
npm install
cp .env.example .env          # then fill in values
npm run db:push               # creates tables in Postgres
npm run seed:demo             # optional: loads 8 demo products + a test admin
npm run dev                   # starts on http://localhost:5001
```

`.env` keys:
```
PORT=5001
DATABASE_URL=postgresql://USER@localhost:5432/reesha
JWT_SECRET=paste_a_long_random_string_here
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Demo admin (after `seed:demo`): `admin@reesha.local` / `reesha123`

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                   # starts on http://localhost:5173
```

---

## 2. API reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/login` | public | returns `{ token, admin }` |
| GET  | `/api/auth/me` | admin | current admin from JWT |
| GET  | `/api/products` | public | list; supports `category`, `size`, `minPrice`, `maxPrice`, `search`, `featured`, `page`, `limit` |
| GET  | `/api/products/:slug` | public | fetch by slug |
| POST | `/api/products` | admin | create (multipart/form-data with `images`) |
| PUT  | `/api/products/:id` | admin | update (multipart; `keepImages` = JSON array of URLs to keep) |
| DELETE | `/api/products/:id` | admin | delete product + Cloudinary images |

---

## 3. Deploy to ServerMe

The backend serves the built frontend, so everything ships as **one ServerMe project**.

### Provision a Postgres database
In your ServerMe dashboard, create a Postgres addon / service for the project. ServerMe exposes a `DATABASE_URL` (either auto-injected or shown as a connection string you paste into env vars).

### Project config
| Field | Value |
|---|---|
| **Project Name** | `reesha` |
| **Subdomain** | `reesha` (gives `reesha.serverme.site`) |
| **Root Directory** | *(leave empty — repo root)* |
| **Node Version** | `20` |
| **Install Command** | `npm ci --prefix backend && npm ci --prefix frontend` |
| **Build Command** | `npm run build --prefix frontend` |
| **Start Command** | `npm start --prefix backend` |
| **Port** | `0` (auto — server reads `$PORT`) |

The backend's `npm start` runs `prisma db push` before booting, so the Postgres schema is created on first deploy and kept in sync on later deploys.

### Environment variables
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname    # from ServerMe Postgres
JWT_SECRET=paste_a_long_random_string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ORIGIN=https://reesha.serverme.site
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Seed the first admin user
After the first deploy, set `DATABASE_URL` in your **local** `backend/.env` temporarily to the production value, then run:
```bash
cd backend
npm run seed:admin
```
This inserts your admin into the live Postgres. Switch `DATABASE_URL` back to local Postgres when you're done.

---

## 4. Post-launch checklist

- [ ] Add real products with photos via `/admin`
- [ ] Replace Instagram placeholder — set `VITE_INSTAGRAM_HANDLE` and embed a SnapWidget/Elfsight feed
- [ ] Point a custom domain (e.g. `reeshawears.com`) at the ServerMe project
- [ ] Test "Order on WhatsApp" on a real phone

## Brand reference

- **Name**: Reesha Wears and Thrift
- **Phone / WhatsApp**: +234 816 151 8807
- **Email**: Akinolamojisola31@gmail.com
- **Location**: Osogbo, Osun State — Nationwide delivery
- **Categories**: Baggy jeans · Bum shorts · Jorts · Maxi skirts · Imported wears
