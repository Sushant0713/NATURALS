# RAANJAAI NATURALS

> *Nature's bounty in every grain!*

Premium organic and heritage Indian food e-commerce platform.

## Project Structure

```
raanjaai-naturals/
├── client/                 # Next.js storefront (TypeScript + Tailwind)
├── server/                 # Express API server (TypeScript)
├── package.json            # Root workspace config
├── turbo.json              # Turborepo task orchestration
├── .prettierrc             # Shared Prettier config
├── .gitignore
└── README.md
```

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Client   | Next.js 15, React 19, Tailwind CSS  |
| Server   | Express 5, MongoDB, Mongoose, TypeScript |
| Tooling  | Turborepo, ESLint, Prettier, tsx    |

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **MongoDB** >= 6.0 (local or Atlas)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
# Client
cp client/.env.example client/.env.local

# Server
cp server/.env.example server/.env
```

### 3. Run development servers

```bash
# Run both client and server
npm run dev

# Or run individually
npm run dev:client   # http://localhost:3000
npm run dev:server   # http://localhost:4000
```

### 4. Verify setup

- **Client**: Open [http://localhost:3000](http://localhost:3000)
- **Server health**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

## Available Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start client + server (Turborepo)  |
| `npm run dev:client` | Start Next.js dev server           |
| `npm run dev:server` | Start Express API server           |
| `npm run build`      | Build all workspaces               |
| `npm run lint`       | Lint all workspaces                |
| `npm run typecheck`  | Type-check all workspaces          |
| `npm run format`     | Format code with Prettier          |
| `npm run format:check` | Check formatting                 |

## Path Aliases

Both `client` and `server` use `@/*` mapped to `src/*`:

```typescript
// Client & Server
import { brand } from '@/constants/brand';
import { appConfig } from '@/config/app.config';
```

## Client Structure

```
client/src/
├── app/              # Next.js App Router pages
├── components/       # React components (Phase 2+)
├── config/           # App & API configuration
├── constants/        # Brand, routes, categories
├── lib/              # Utility functions
└── types/            # Shared TypeScript types
```

## Server Structure

```
server/src/
├── config/           # env, database, logger
├── constants/        # Brand, HTTP status, error codes
├── controllers/      # Request handlers
├── middleware/       # Error handler, validation, rate limit, security
├── models/           # Mongoose models & base schema helpers
│   └── schemas/      # Embedded sub-schemas (variants, order items, etc.)
├── routes/           # API route definitions
├── services/         # Business logic layer
├── utils/            # AppError, async handler, API response helpers
├── validators/       # Zod validation schemas
├── types/            # Shared TypeScript types
├── app.ts            # Express app factory
└── index.ts          # Server bootstrap + graceful shutdown
```

## Design Tokens

Brand colors are defined in `client/src/design-system/tokens/colors.ts`:

| Token     | Hex       |
| --------- | --------- |
| White     | `#FFFFFF` |
| Gold      | `#FFBB59` |
| Amber     | `#F18F01` |
| Forest    | `#2D5028` |
| Burgundy  | `#4B0F0F` |

View the live showcase at `/design-system` when running the client.

## API

Base URL: `http://localhost:4000/api/v1`

| Endpoint  | Method | Description    |
| --------- | ------ | -------------- |
| `/health` | GET    | Health check   |

## Development Phases

- [x] **Phase 1** — Project setup & configuration
- [x] **Phase 2** — Express backend (MongoDB, middleware, validation, security)
- [x] **Phase 3** — MongoDB models (Users, Products, Orders, etc.)
- [x] **Phase 4** — Authentication (JWT, OAuth, RBAC, secure cookies)
- [x] **Phase 5** — Design system (components, theme, dark mode)
- [x] **Phase 6** — Home page (full storefront landing)
- [x] **Phase 7** — Product listing (search, filters, sort, pagination, quick view, wishlist)
- [x] **Phase 8** — Product detail page (gallery, zoom, nutrition, reviews, related products)
- [x] **Phase 9** — Cart (mini cart, coupons, shipping, tax, protected route)
- [x] **Phase 10** — Checkout (address, Cashfree test mode, invoice, success/failure)
- [x] **Phase 11** — User dashboard (profile, orders, wishlist, addresses, reviews, coupons, notifications, settings)
- [x] **Phase 12** — Admin panel (dashboard, analytics, orders, products, categories, users, inventory, coupons, reviews, blogs, reports, banner management)

### Admin Panel

Access at `/admin/login` (requires `ADMIN` or `SUPER_ADMIN` role). After login, use the sidebar to manage:

- **Dashboard** — Store overview, recent orders, low-stock alerts
- **Analytics** — Revenue and order trends (7/30/90 days)
- **Orders** — List, filter, and update order status
- **Products** — CRUD + sync from catalogue
- **Categories**, **Users**, **Inventory**, **Coupons**, **Reviews**, **Blogs**, **Reports**, **Banners**

Admin API: `POST /api/v1/auth/admin/login` · Protected routes: `/api/v1/admin/*`

- [x] **Phase 13** — API integration (Axios, TanStack Query, caching, error handling, loading states, optimistic updates)

### API Integration

- **Axios** — HTTP client with auth interceptors, timeout, and structured `ApiError` handling (`lib/api/axios-client.ts`)
- **TanStack Query** — Server state via `QueryProvider` and hooks in `hooks/queries/`
- **Caching** — `staleTime` / `gcTime` defaults; query keys in `lib/query/query-keys.ts`
- **Error handling** — `ApiError` + `QueryError` component with retry
- **Loading states** — `QueryLoading` skeletons on account, checkout, and admin pages
- **Optimistic updates** — Wishlist, notifications, admin review moderation, account review delete

- [x] **Phase 14** — SEO (metadata, Open Graph, Twitter Cards, JSON-LD schema, robots.txt, sitemap, image optimization, lazy loading, performance)

### SEO & Performance

- **Metadata** — Central `createPageMetadata()` with canonical URLs, keywords, and `metadataBase`
- **Open Graph & Twitter** — `summary_large_image` cards on all public pages
- **JSON-LD** — Organization, WebSite, Product, BreadcrumbList, FAQPage, ItemList schemas
- **robots.txt** — `app/robots.ts` blocks admin, account, cart, checkout
- **Sitemap** — `app/sitemap.ts` with home, products, categories, and all 24 SKUs
- **Images** — `OptimizedImage` component (AVIF/WebP, blur placeholder, lazy load)
- **Performance** — `compress`, cache headers, `optimizePackageImports` for lucide-react

## Brand Contact
- **Instagram**: [@RAANJAAINATURALS](https://instagram.com/RAANJAAINATURALS)

## License

Private — All rights reserved.
