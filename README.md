# PANDORE

A premium E-Commerce & Delivery platform built with Django REST Framework and Next.js 16.

## Stack

**Backend:** Django · DRF · SimpleJWT (HTTP-only cookies) · SQLite (dev)

**Frontend:** Next.js 16 (App Router) · TypeScript · Axios · TanStack Query v5 · Zustand · Framer Motion · Shadcn/UI · `@uiw/react-md-editor`

## Roles

| Role | Access |
|---|---|
| **Admin** | Full platform management |
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

---

## Backend Architecture

The backend is fully decoupled — each Django app owns a single responsibility.

```
backend/
  authentication/   → JWT cookie login, logout, refresh, register, me
  users/            → User model, profile update, password change, admin user management
  addresses/        → ShippingAddress model + CRUD
  wishlist/         → Wishlist model + toggle (add/remove)
  payments/         → PaymentMethod + Payment (simulated confirmation)
  newsletter/       → Subscriber + Newsletter (draft/send simulation)
  currencies/       → Currency model + rate conversion (XAF base)
  site_config/      → SiteSettings singleton + SocialLink
  catalog/          → Category, Tag, Product, HomepageSection
  orders/           → Order, OrderItem, DeliveryAssignment
  core/             → Shared permissions (IsAdminRole, IsDelivery)
```

## API Endpoints

```
# Auth
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/

# Users
PATCH  /api/users/profile/
DELETE /api/users/profile/avatar/
POST   /api/users/password/
GET    /api/users/delivery-personnel/
GET    /api/users/admin/users/
PATCH  /api/users/admin/users/:id/
DELETE /api/users/admin/users/:id/delete/

# Addresses
GET|POST   /api/addresses/
PATCH|DEL  /api/addresses/:id/

# Wishlist
GET|POST   /api/wishlist/

# Catalog
GET    /api/catalog/products/        ?search=&category=&tags=&ordering=
GET    /api/catalog/products/:slug/
GET    /api/catalog/categories/
GET    /api/catalog/tags/
GET    /api/catalog/homepage/
# Admin catalog
GET|POST        /api/catalog/admin/products/
PATCH|DEL       /api/catalog/admin/products/:id/
GET|POST        /api/catalog/admin/categories/
PATCH|DEL       /api/catalog/admin/categories/:id/
GET|POST        /api/catalog/admin/tags/
PATCH|DEL       /api/catalog/admin/tags/:id/
GET|POST        /api/catalog/admin/homepage/
PATCH|DEL       /api/catalog/admin/homepage/:id/

# Orders
POST   /api/orders/checkout/
GET    /api/orders/my-orders/
GET    /api/orders/admin/            ?status=
POST   /api/orders/admin/:id/assign/
GET    /api/orders/delivery/queue/
PATCH  /api/orders/delivery/:id/status/

# Payments
GET    /api/payments/methods/
POST   /api/payments/:orderId/confirm/
GET|POST        /api/payments/admin/methods/
PATCH|DEL       /api/payments/admin/methods/:id/
GET             /api/payments/admin/payments/

# Newsletter
POST   /api/newsletter/subscribe/
POST   /api/newsletter/unsubscribe/
GET    /api/newsletter/check/        ?email=
GET             /api/newsletter/admin/subscribers/
GET|POST        /api/newsletter/admin/newsletters/
PATCH|DEL       /api/newsletter/admin/newsletters/:id/
POST            /api/newsletter/admin/newsletters/:id/send/

# Currencies
GET    /api/currencies/
GET|POST        /api/currencies/admin/
PATCH|DEL       /api/currencies/admin/:id/

# Site Config
GET    /api/site-config/
GET|PATCH       /api/site-config/admin/
DELETE          /api/site-config/admin/logo/
GET|POST        /api/site-config/admin/social/
PATCH|DEL       /api/site-config/admin/social/:id/
```

---

## Frontend Architecture

```
src/
  app/
    (auth)/         → login, register
    (shop)/         → homepage, catalog, product, cart, checkout, orders, wishlist, profile
    admin/          → orders, products, categories, tags, homepage, payments,
                      newsletter, currencies, users, site-settings
    delivery/       → queue, active, completed
  components/
    admin/          → tab components for each admin section
    home/           → HeroCarousel, ProductRow, CategoryBanner, PromoBanner
    layout/         → Navbar, Footer, AdminSidebar, DeliverySidebar
    profile/        → ProfileInfoTab, AddressesTab, ChangePasswordTab, NewsletterTab
    shop/           → ProductCard, OrderCard, WishlistButton, RecentlyViewed
    ui/             → Shadcn components
  hooks/            → useAuth, useCatalog, useOrders, usePayments, useWishlist,
                      useNewsletter, useCurrencies, useSiteConfig, useProfile, useAddresses
  store/            → cart (Zustand + persist), currency (Zustand + persist), recentlyViewed
  lib/              → api.ts (all API calls), axios.ts (interceptors + auto-refresh), utils.ts
  types/            → index.ts (single source of truth for all TypeScript types)
  context/          → AuthContext (JWT state, no localStorage)
```

## Key Features

### Customer
- Catalog with search, category & tag filters, price ordering
- Product detail with attributes, related products, recently viewed
- Cart (Zustand, persisted) → Checkout (address + payment method) → Simulated payment confirmation
- Order tracking with status progress
- Wishlist with add/remove
- Profile: avatar upload/delete, shipping addresses, password change, newsletter subscription

### Admin
- Dashboard with revenue stats and recent orders
- Full CRUD: products, categories, tags, homepage sections
- Order management with delivery assignment
- Payment methods management + payment history
- Newsletter: markdown editor, draft/send simulation, subscriber list
- Multi-currency: XAF base, custom rates, display conversion everywhere
- Site settings: name, tagline, description, logo, contact, location, shipping price/threshold
- Social links management
- User & role management

### Delivery
- Personal order queue
- Step-by-step status updates (assigned → picked up → in transit → delivered)

## Currency System

All prices are stored in **XAF** (CFA Franc BEAC). The admin can add currencies with custom exchange rates. Users select their preferred currency from the navbar — prices are converted and formatted client-side using `formatPrice(amount, currency)` from `store/currency.ts`.

## Payment System (Simulated)

Payment methods are managed by the admin (name, logo, instructions). At checkout, the customer selects a method. After order creation, a 2-second simulation screen auto-confirms the payment and generates a `SIM-XXXX` transaction reference.

## Newsletter System (Simulated)

Customers subscribe via the footer or profile page. The admin writes newsletters using a markdown editor and sends them with one click — the backend counts active subscribers and marks the newsletter as sent (no real email is sent in dev).
