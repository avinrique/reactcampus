# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReactCampus is a full-stack college discovery platform (CampusOption-style) with a React frontend, Express backend, and MongoDB database. It features admin content management, dynamic forms, lead tracking, and Shiksha.com-inspired public pages.

## Development Commands

```bash
# Backend (from root)
npm run dev              # Start Express server with nodemon (default port 5000)
npm run seed             # Seed database (permissions, roles, admin, colleges, etc.)
npm start                # Production start

# Frontend (from client/)
cd client && npm run dev     # Start Vite dev server on port 3000 (proxies /api to :5050)
cd client && npm run build   # Production build
cd client && npm run lint    # ESLint check
```

**Note:** The Vite proxy in `client/vite.config.ts` forwards `/api` requests to `localhost:5050`, but the server default port in `.env.example` is 5000. Ensure these match.

## Architecture

### Monorepo Structure
- **`/server`** — Express API (JavaScript, CommonJS). Entry: `server/src/server.js`
- **`/client`** — React 19 SPA (TypeScript, Vite). Entry: `client/src/main.tsx`
- Root `package.json` is the backend package

### Backend Layers (server/src/)
Each resource follows: **Route → Controller → Service → Model**
- `routes/` — Express routers mounted at `/api/v1` via `routes/index.js`
- `controllers/` — Request handling, calls services
- `services/` — Business logic, Mongoose queries
- `models/` — Mongoose schemas
- `validations/` — Joi schemas used by `validateRequest` middleware
- `middlewares/` — `authenticate`, `authorize`, `authorizeAny`, `asyncHandler`, `errorHandler`, `validateRequest`
- `permissions/` — `permissionRegistry.js` defines all permissions; `permissionLoader.js` syncs to DB on startup; `permissionCache.js` is an LRU cache

### Frontend Layers (client/src/)
Feature-based organization: each feature in `features/` has `pages/`, `hooks/`, `services/` subdirs.
- `stores/authStore.ts` — Zustand store for auth state (user, permissions, tokens)
- `lib/axios.ts` — Axios instance with JWT interceptor and automatic refresh token rotation
- `lib/queryClient.ts` — TanStack Query config (5min stale time, 1 retry)
- `config/queryKeys.ts` — Query key factories per domain
- `config/permissions.ts` — `PERMISSIONS` constants and `PERMISSION_GROUPS`
- `config/constants.ts` — Enums, status values, color mappings
- `components/guards/` — `AuthGuard`, `GuestGuard`, `PermissionGuard`
- `router/` — `adminRoutes.tsx` (protected, permission-guarded), `publicRoutes.tsx`
- `types/` — TypeScript interfaces for all entities and API responses

### Two Layouts
- **PublicLayout** — Header + Footer, public-facing pages at `/`, `/colleges`, `/courses`, `/exams`
- **AdminLayout** — Sidebar + TopBar, admin dashboard at `/admin/*`

## Key Patterns

### Authentication Flow
JWT with refresh token rotation. Access tokens (15min) in localStorage. Axios interceptor queues failed requests during refresh. Server uses token family tracking to detect reuse attacks. Auth logic lives in `server/src/auth/`.

### RBAC
50+ permissions defined in `server/src/permissions/permissionRegistry.js`. Frontend mirrors them in `client/src/config/permissions.ts`. Middleware: `authorize(...perms)` = AND logic, `authorizeAny(...perms)` = OR logic. Routes wrapped with `PermissionGuard` on client.

### Content Sections
Polymorphic content model (`ContentSection`) attachable to colleges, courses, or exams. Types: `richtext`, `table`, `faq`, `gallery`, `list`. Organized by tabs (Overview, Placements, Admission, etc.).

### API Response Shape
```js
// Success: { success: true, message: "...", data: {...} }
// Paginated: { success: true, data: [...], pagination: { total, page, limit, pages } }
// Error: { success: false, message: "...", errors: [...] }
```
Utilities: `server/src/utils/ApiResponse.js`, `server/src/utils/ApiError.js`.

### Public vs Admin Routes (Server)
- Admin routes: `server/src/routes/*.routes.js` — require `authenticate` + `authorize`
- Public routes: `server/src/routes/public.routes.js` — unauthenticated, read-only

### Adding a New Resource
1. Create model in `server/src/models/`
2. Add Joi validation in `server/src/validations/`
3. Create service in `server/src/services/`
4. Create controller in `server/src/controllers/`
5. Create routes in `server/src/routes/`, mount in `routes/index.js`
6. Add permissions to `server/src/permissions/permissionRegistry.js`
7. On client: add types in `types/`, service in `features/<name>/services/`, hooks in `hooks/`, pages in `pages/`
8. Add query keys to `client/src/config/queryKeys.ts`
9. Add permissions to `client/src/config/permissions.ts`
10. Add routes to `client/src/router/adminRoutes.tsx` (and/or `publicRoutes.tsx`)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router 7, Zustand, TanStack Query, React Hook Form + Zod |
| Backend | Node.js, Express, Mongoose, Joi, JWT (jsonwebtoken), bcryptjs, Winston |
| Database | MongoDB (with geospatial indexes on College locations) |

## Environment

Copy `.env.example` to `.env`. Key vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT`.
