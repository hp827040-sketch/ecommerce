# FreshBasket 🥬

Premium local departmental store & fresh vegetable delivery platform.

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL (WAMP/XAMPP)
- npm

### 1. Database

Create a MySQL database named `freshbasket`.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL

npm install
npm run db:push
npm run db:seed
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Default Logins

| Role     | Email                    | Password     |
|----------|--------------------------|--------------|
| Admin    | admin@freshbasket.com     | admin123     |
| Customer | customer@freshbasket.com  | customer123  |

## Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design, API flows, and implementation plan.

## Tech Stack

**Frontend:** React 19, React Router, Tailwind CSS, Framer Motion, TanStack Query, Zod, React Hook Form

**Backend:** Node.js, Express, Prisma, JWT, bcrypt, Multer, PDFKit

**Database:** MySQL
