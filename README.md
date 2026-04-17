# Reesha Wears & Thrift

Minimal-luxury e-commerce site for **Reesha Wears and Thrift** — a thrift & imported clothing shop based in Osogbo, Osun State, Nigeria.

- **Checkout**: Pre-filled WhatsApp orders to `+2348161518807`
- **Frontend**: React + Vite + Tailwind
- **Backend**: Node/Express + MongoDB (Mongoose)
- **Image hosting**: Cloudinary
- **Admin**: Email/password login, product CRUD with image uploads

## Repo layout

```
reesha/
├── backend/        # Express + MongoDB API (deploy on Railway / Render)
└── frontend/       # React + Vite + Tailwind (deploy on Vercel / Netlify)
```

---

## 1. Backend setup

### Prerequisites
- Node 18+
- A MongoDB database (free tier at [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Cloudinary account (free tier at [cloudinary.com](https://cloudinary.com))

### Steps
```bash
cd backend
npm install
cp .env.example .env          # then fill in the values
npm run dev                   # starts on http://localhost:5000
```

`.env` keys:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=change_me_to_a_long_random_string
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Create the first admin user
```bash
npm run seed:admin
# enter email, name, password when prompted
```

### API endpoints
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/login` | public | admin login → `{ token, admin }` |
| GET  | `/api/auth/me` | admin | current admin |
| GET  | `/api/products` | public | list (supports `category`, `size`, `minPrice`, `maxPrice`, `search`, `featured`, `page`, `limit`) |
| GET  | `/api/products/:slug` | public | product by slug |
| POST | `/api/products` | admin | create (multipart, `images` field) |
| PUT  | `/api/products/:id` | admin | update (multipart; `keepImages` is a JSON array of URLs to keep) |
| DELETE | `/api/products/:id` | admin | delete product + its Cloudinary images |

---

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env          # defaults point at local backend
npm run dev                   # starts on http://localhost:5173
```

`.env` keys:
```
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=2348161518807
VITE_INSTAGRAM_HANDLE=reeshawears
```

### Routes
- `/` — home
- `/shop` — catalog with filters (category, size, price, search)
- `/product/:slug` — product detail with Order-on-WhatsApp
- `/about` — brand story + contact
- `/wishlist` — saved items (localStorage)
- `/admin/login` — staff login
- `/admin` — product dashboard (protected)

---

## 3. Deployment

### Backend → Railway (or Render)
1. Push `backend/` to a GitHub repo
2. On Railway, create a new project → Deploy from repo → pick the backend folder
3. Set all env vars from `.env.example`
4. Railway auto-builds on push. Note the public URL (e.g. `https://reesha-api.up.railway.app`)

### Frontend → Vercel
1. Push `frontend/` to a GitHub repo
2. Import the project on Vercel → framework **Vite**
3. Set env vars:
   - `VITE_API_URL=https://<your-railway-url>/api`
   - `VITE_WHATSAPP_NUMBER=2348161518807`
   - `VITE_INSTAGRAM_HANDLE=<your handle>`
4. Add the Vercel URL to the backend's `CORS_ORIGIN` (comma-separated if multiple)
5. Deploy

---

## 4. Post-launch checklist

- [ ] Run `npm run seed:admin` against production Mongo
- [ ] Sign in at `/admin/login`, add 6–10 real products with photos
- [ ] Test "Order on WhatsApp" flow on a real phone
- [ ] Replace Instagram placeholder with real handle (or embed an Elfsight / SnapWidget in `InstagramFeed.jsx`)
- [ ] Supply a real logo SVG (currently a simple "R" favicon)
- [ ] Optional: point a custom domain at Vercel (e.g. reeshawears.com)

## Brand reference

- **Name**: Reesha Wears and Thrift
- **Phone / WhatsApp**: +234 816 151 8807
- **Email**: Akinolamojisola31@gmail.com
- **Location**: Osogbo, Osun State — Nationwide delivery
- **Categories**: Baggy jeans · Bum shorts · Jorts · Maxi skirts · Imported wears
