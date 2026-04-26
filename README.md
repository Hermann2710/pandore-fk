# PANDORE

A premium E-Commerce & Delivery platform built with Django REST Framework and Next.js 16.

## Stack

**Backend:** Django 6 · DRF · SimpleJWT (HTTP-only cookies) · SQLite (dev)

**Frontend:** Next.js 16 (App Router) · TypeScript · Axios · TanStack Query v5 · Zustand · Framer Motion · Shadcn/UI (Emerald & Slate theme)

## Roles

| Role | Access |
|---|---|
| **Admin** | Full order management, assigns deliveries |
| **Delivery** | Personal queue, real-time status updates |
| **Customer** | Catalog, cart, checkout, order tracking |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py shell < seed_catalog.py
python manage.py runserver
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `delivery1` | `delivery123` | Delivery |
| `delivery2` | `delivery123` | Delivery |
| `customer1` | `customer123` | Customer |

## API Endpoints

```
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/
GET    /api/catalog/products/        ?search=&category=&tags=&ordering=
GET    /api/catalog/products/:slug/
GET    /api/catalog/categories/
GET    /api/catalog/tags/
POST   /api/orders/checkout/
GET    /api/orders/my-orders/
GET    /api/orders/admin/            ?status=
POST   /api/orders/admin/:id/assign/
GET    /api/orders/delivery/queue/
PATCH  /api/orders/delivery/:id/status/
```
