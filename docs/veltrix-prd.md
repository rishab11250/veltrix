# Veltrix — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Status:** Production-Ready Specification  
> **Stack:** MERN (MongoDB · Express · React · Node.js)  
> **Audience:** AI agents, developers, and technical reviewers

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend Specification](#3-frontend-specification)
4. [Backend Specification](#4-backend-specification)
5. [Design System](#5-design-system)
6. [GitHub & DevOps](#6-github--devops)
7. [Integration Points](#7-integration-points)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Edge Cases & Constraints](#9-edge-cases--constraints)
10. [Implementation Guidelines for AI](#10-implementation-guidelines-for-ai)

---

## 1. Project Overview

### 1.1 Vision

Veltrix is a **dark-themed, premium SaaS financial management dashboard** built for small business owners and freelancers. It consolidates invoice creation, payment tracking, client management, and cash-flow analytics into one intuitive interface — replacing fragmented tools like spreadsheets, WhatsApp notes, and UPI chaos with a single source of financial truth.

> _"Your Business Finances. Finally Clear."_

### 1.2 Objectives

- Provide a **complete invoice lifecycle** — create, send, track, and close invoices
- Enable **real-time payment tracking** with Kanban-style status management (Pending / Paid / Overdue)
- Deliver **actionable financial analytics** through rich, premium-styled charts
- Maintain a **client CRM layer** with billed and pending amounts per client
- Offer a **polished onboarding experience** (Landing → Signup → Dashboard) comparable to a Series-A SaaS product
- Simulate a **real-world team development workflow** with clean Git history, structured PRs, and modular code

### 1.3 Key Features

| Feature | Description |
|---|---|
| Authentication | JWT-based login / signup with bcrypt hashing |
| Dashboard | Summary cards (Revenue, Pending, Overdue, Monthly) + cash flow chart |
| Invoice Management | Form with live preview, line items, real-time totals, status lifecycle |
| Client Management | Card/grid view, per-client financials, full CRUD |
| Payment Tracking | Table view, status badges, Kanban board |
| Analytics | Monthly trends, cash flow graphs, business insights |
| Settings | Profile, business details, preferences |
| Landing Page | Conversion-focused public page with hero, features, testimonials, CTA |
| Dark Theme | Default dark mode persisted in localStorage |
| Notifications | Toast alerts for success/error + overdue invoice alerts |
| File Upload (optional) | Business logo, invoice export via Cloudinary/S3 |

---

## 2. System Architecture

### 2.1 High-Level Architecture (Textual Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│   React (Vite) + Tailwind CSS + Redux Toolkit + React Router    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Landing  │  │  Auth    │  │Dashboard │  │ Protected App │  │
│  │  Page    │  │  Pages   │  │ + Widgets│  │    Pages      │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│                      │                              │           │
│               Axios (centralized instance + interceptors)       │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP / REST (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js + Express)                 │
│                                                                 │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │   Auth    │  │ Invoice  │  │  Client  │  │  Analytics  │  │
│  │  Module   │  │  Module  │  │  Module  │  │   Module    │  │
│  └───────────┘  └──────────┘  └──────────┘  └─────────────┘  │
│                                                                 │
│  Middleware: authMiddleware · errorHandler · CORS · RateLimit   │
│  Services Layer: Business Logic (invoice status, client sums)   │
│  Utils: Validators (Zod/Joi) · Helpers                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud DB)                      │
│                                                                 │
│   Collections: users · clients · invoices · payments           │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
   ┌────────────────────┐          ┌────────────────────────┐
   │  Cloudinary / S3   │          │  Future: Socket.io     │
   │  (File Uploads)    │          │  (Real-time updates)   │
   └────────────────────┘          └────────────────────────┘
```

### 2.2 Frontend ↔ Backend Interaction

All frontend-backend communication happens via RESTful HTTP using Axios with a centralized instance. Every protected request attaches a JWT in the `Authorization: Bearer <token>` header via an Axios request interceptor. Error responses from the server are caught by a response interceptor and dispatched to Redux or displayed via toast notifications.

**Example — Create Invoice:**
1. React invoice form collects data and triggers form submission handler
2. Axios POSTs to `/api/v1/invoices` with JWT header
3. Express `authMiddleware` verifies JWT, attaches `req.user`
4. Controller delegates to `invoiceService.createInvoice()`
5. Service validates input, persists to MongoDB, updates `client.totalBilled`
6. Returns `{ success: true, data: invoice }` JSON
7. Redux `invoiceSlice` updates state; UI re-renders invoice list

**Example — Load Dashboard:**
1. Dashboard component mounts; dispatches Redux thunks
2. Parallel Axios calls: `GET /api/v1/analytics/summary`, `GET /api/v1/invoices?limit=5`
3. Both resolve; Redux stores normalized data
4. Summary cards and charts render with populated data

### 2.3 Data Flow

```
User Action
    │
    ▼
React Component (event handler)
    │
    ▼
Redux Thunk (async action)
    │
    ▼
Axios Service (services/ directory)
    │  Authorization: Bearer <JWT>
    ▼
Express Route → Controller → Service → Mongoose Model
    │
    ▼
MongoDB Atlas
    │
    ▼
JSON Response { success, data, message }
    │
    ▼
Redux Slice (fulfilled/rejected reducers)
    │
    ▼
React Component re-renders
```

---

## 3. Frontend Specification

### 3.1 Tech Stack

**Core:**
- React (via Vite) — component framework
- Tailwind CSS — utility-first styling
- Redux Toolkit — global state management
- React Router DOM — client-side routing

**Supporting Libraries:**
- Axios — HTTP client with interceptors
- React Hook Form or Formik + Yup — form handling and validation
- Framer Motion — animations and transitions
- Recharts — data visualization (charts)

### 3.2 Folder Structure

```
client/
└── src/
    ├── components/
    │   ├── ui/               # Primitive components: Button, Input, Card, Modal,
    │   │                     #   Table, Badge, Loader
    │   ├── layout/           # Sidebar, Navbar/Topbar, PageWrapper
    │   └── charts/           # Recharts wrappers (optional for dashboard)
    │
    ├── pages/
    │   ├── public/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── SignupPage.jsx
    │   └── dashboard/
    │       ├── DashboardPage.jsx
    │       ├── InvoicesPage.jsx
    │       ├── ClientsPage.jsx
    │       └── SettingsPage.jsx
    │
    ├── features/             # Redux slices
    │   ├── authSlice.js
    │   ├── userSlice.js
    │   ├── invoiceSlice.js
    │   ├── clientSlice.js
    │   └── uiSlice.js
    │
    ├── hooks/                # Custom React hooks
    ├── services/             # Axios API call functions (per module)
    ├── utils/                # Formatters, date helpers, constants
    ├── App.jsx               # Route definitions
    └── main.jsx              # Entry point, Redux Provider, Router
```

### 3.3 Routing Structure

```
/ ───────────────────── LandingPage        [Public]
/login ──────────────── LoginPage          [Public]
/signup ─────────────── SignupPage         [Public]

/app ────────────────── ProtectedLayout    [Requires JWT]
  /app/dashboard ────── DashboardPage
  /app/invoices ──────── InvoicesPage
  /app/clients ───────── ClientsPage
  /app/settings ──────── SettingsPage
```

**Route Guard Logic:**
- A `ProtectedRoute` component wraps `/app/*` routes
- Reads JWT from Redux state (hydrated from localStorage on app init)
- Redirects unauthenticated users to `/login`
- Authenticated users accessing `/login` or `/signup` are redirected to `/app/dashboard`

**Performance:** All `/app/*` page components are **lazy-loaded** using `React.lazy()` + `<Suspense>` with skeleton loaders as fallback.

### 3.4 Pages — Detailed Specification

#### 3.4.1 Landing Page (`/`)

**Goal:** Convert visitors into registered users.

**Sections (in order):**

1. **Hero Section**
   - Headline: _"Your Business Finances. Finally Clear."_
   - Subtext: _"Track invoices, payments, and cash flow in one simple dashboard."_
   - Primary CTA: "Get Started Free" → `/signup`
   - Secondary CTA: "See Demo" → scroll to visual showcase or demo modal
   - Background: dark gradient (`#0F0F0F` → `#1A1A1A`)
   - Visual: product mockup screenshot of dashboard

2. **Features Section**
   - 3–4 feature cards, each with icon + title + short description
   - Features: Smart Invoicing · Payment Tracking · Cash Flow Insights · Client Management

3. **Problem → Solution Section**
   - Before column: WhatsApp notes, Excel sheets, UPI chaos
   - After column: One clean Veltrix dashboard

4. **Visual Showcase**
   - Screenshots/mockups of: Dashboard · Invoice screen · Analytics

5. **Testimonials (optional)**
   - 2–3 realistic fake quotes from small business personas

6. **CTA Section**
   - Text: _"Start managing your finances in minutes"_
   - Button: "Create Free Account" → `/signup`

7. **Footer**
   - Product name, basic links

#### 3.4.2 Login Page (`/login`)

**Layout:** Split-screen

- **Left panel:** Veltrix branding, tagline, dark gradient or illustration
- **Right panel:** Form card

**Form Fields:**
- Email (type="email", required)
- Password (type="password", required)
- "Remember me" checkbox

**Extras:**
- "Forgot password?" link (UI only, no backend required initially)
- "Don't have an account? Sign up" link → `/signup`

**Behavior:**
- Inline validation on blur using React Hook Form + Yup
- On submit: dispatches `loginThunk` → POST `/api/v1/auth/login`
- On success: stores JWT in Redux + localStorage, redirects to `/app/dashboard`
- On error: displays error toast + inline field error

#### 3.4.3 Signup Page (`/signup`)

**Layout:** Same split-screen as Login

**Form Fields:**
- Name (required)
- Email (required, unique)
- Password (required, min 8 chars)
- Business Name (required)

**Behavior:**
- Inline validation same as Login
- On submit: dispatches `registerThunk` → POST `/api/v1/auth/register`
- On success: auto-login (stores JWT), redirects to `/app/dashboard`
- "Already have an account? Log in" link → `/login`

#### 3.4.4 Dashboard Page (`/app/dashboard`)

**Sections:**

1. **Summary Cards Row** (3 cards)
   - Total Invoices
   - Pending Invoices
   - Paid Invoices
   - Each card: icon, label, count (large bold number)

2. **Recent Invoices Table**
   - Columns: Invoice #, Client, Amount, Status, Due Date, Actions
   - Status badges: Paid (green) · Pending (yellow) · Overdue (red)
   - Limit: last 10 records
   - Quick action buttons: View · Edit · Delete

#### 3.4.5 Invoice Page (`/app/invoices`)

**Views:**
- **List view:** Full table of all invoices with filters (status, date range), search, pagination
- **Create/Edit Invoice form** (modal or dedicated page):
  - Client selector (dropdown from loaded clients)
  - Issue Date + Due Date pickers
  - Line items table: add/remove rows, each with Name, Quantity, Unit Price → auto-calculated subtotal
  - Notes field
  - Live total calculation (subtotal, optional tax, total)
  - Preview pane (optional): shows formatted invoice as user fills form

**Actions:** Create · Edit · Delete · Mark as Paid · Download (future)

#### 3.4.6 Client Page (`/app/clients`)

**Layout:** Card grid (3–4 columns on desktop)

**Client Card shows:**
- Client name, email, phone
- Total Billed amount
- Pending amount
- Number of invoices
- Quick actions: View · Edit · Delete

**Create/Edit Client:** modal form with fields: Name, Email, Phone

#### 3.4.7 Settings Page (`/app/settings`)

**Sections:**
- **Profile:** Name, Email (read-only), Business Name
- **Security:** Change password form (optional for MVP)

### 3.5 State Management (Redux Toolkit)

**Store Slices:**

| Slice | State Shape | Purpose |
|---|---|---|
| `authSlice` | `{ user, token, isAuthenticated, loading, error }` | Auth state, JWT, login/logout |
| `userSlice` | `{ profile, loading, error }` | User profile data |
| `invoiceSlice` | `{ invoices[], currentInvoice, loading, error }` | Invoice CRUD |
| `clientSlice` | `{ clients[], currentClient, loading, error }` | Client CRUD |
| `uiSlice` | `{ theme, toasts[], sidebarOpen, modal }` | UI state, theme, toast queue |

**Async Thunks** (one per API action):
- `loginThunk`, `registerThunk`, `logoutThunk`
- `fetchInvoicesThunk`, `createInvoiceThunk`, `updateInvoiceThunk`, `deleteInvoiceThunk`
- `fetchClientsThunk`, `createClientThunk`, `updateClientThunk`, `deleteClientThunk`

**Redux Persist:** `authSlice.token` and `uiSlice.theme` are persisted to localStorage via `redux-persist` (or manually in thunks).

### 3.6 API Layer (services/)

A single centralized Axios instance is created in `services/axiosInstance.js`:

```
services/
├── axiosInstance.js     # Base URL, interceptors
├── authService.js       # login(), register(), getMe()
├── invoiceService.js    # CRUD functions for invoices
└── clientService.js     # CRUD functions for clients
```

**Axios Instance Configuration:**
- `baseURL`: `process.env.VITE_API_URL` (e.g., `http://localhost:5000/api/v1`)
- **Request interceptor:** attaches `Authorization: Bearer <token>` from Redux store or localStorage
- **Response interceptor:** on 401, clears auth state and redirects to `/login`; on other errors, normalizes error message for toast display

### 3.7 UX Behavior Standards

| Scenario | Behavior |
|---|---|
| Data loading | Show skeleton loaders (not spinners) matching the layout of the content |
| Empty state | Show illustrative empty state with CTA (e.g., "No invoices yet — Create your first one") |
| API error | Show error UI inline + error toast notification |
| Form validation | Inline validation on blur, clear error on re-focus |
| Success actions | Green toast: "Invoice created successfully" |
| Overdue invoices | Warning alert banner or badge at top of dashboard |
| Page transitions | 150–250ms ease-in-out via Framer Motion |

### 3.8 Theme & Storage

- **Default theme:** Dark
- **Theme persistence:** `localStorage` key `veltrix_theme`
- **Auth token storage:** `localStorage` key `veltrix_token`
- **Form progress (partial):** `sessionStorage` (optional, for invoice form)

### 3.9 Reusable Component Library (components/ui/)

Every component must be built generically and reused across pages. No page-specific logic inside UI components.

| Component | Props / Variants |
|---|---|
| `Button` | variant (primary/secondary/ghost), size (sm/md/lg), loading state, disabled |
| `Input` | type, label, error, placeholder, register (React Hook Form) |
| `Card` | variant (primary/secondary), padding, className |
| `Modal` | isOpen, onClose, title, children, size |
| `Table` | columns[], data[], loading, emptyState |
| `Badge` | status (paid/pending/overdue) → maps to color |
| `Loader` / `Skeleton` | variant matching different layout sections |
| `Toast` | type (success/error/warning), message, auto-dismiss |

---

## 4. Backend Specification

### 4.1 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | HTTP framework, routing |
| MongoDB Atlas | Cloud NoSQL database |
| Mongoose | ODM for schema definition and queries |
| JSON Web Token (JWT) | Stateless authentication |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

### 4.2 Project Structure (Backend)

```
server/
├── src/
│   ├── config/
│   │   └── db.js              # Mongoose connection logic
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Client.js
│   │   └── Invoice.js
│   │
│   ├── controllers/           # Request handlers (CRUD logic)
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   └── invoiceController.js
│   │
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── invoiceRoutes.js
│   │   └── index.js           # Route aggregator
│   │
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   │
│   ├── app.js                 # Express setup
│   └── server.js              # Server start
│
└── package.json
```

**Architectural principle:** Keep it simple. Controllers handle requests → call models → return responses. No service layer, no complex business logic. Pure CRUD operations only.

### 4.3 Database Schema (Mongoose Models)

#### User Model (`users` collection)

```js
{
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 8 },   // bcrypt hashed
  businessName: { type: String, required: true, trim: true },
  createdAt:    { type: Date, default: Date.now }
}
```

Indexes: `email` (unique)

#### Client Model (`clients` collection)

```js
{
  userId:    { type: ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true },
  email:     { type: String },
  phone:     { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

Indexes: `userId`

#### Invoice Model (`invoices` collection)

```js
{
  userId:    { type: ObjectId, ref: 'User', required: true },
  clientId:  { type: ObjectId, ref: 'Client', required: true },
  items: [{
    name:     { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price:    { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  issuedDate:  { type: Date, required: true },
  dueDate:     { type: Date, required: true },
  notes:       { type: String },
  createdAt:   { type: Date, default: Date.now }
}
```

Indexes: `userId`, `createdAt`

### 4.4 REST API Design

**Base URL:** `/api/v1`

All protected routes require: `Authorization: Bearer <token>`

**Standard Response Format:**
```json
// Success
{ "success": true, "data": { ... }, "message": "Optional message" }

// Error
{ "success": false, "message": "Error description" }

// List
{ "success": true, "data": [...] }
```

---

#### Auth Routes (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Get current user profile |

**POST `/auth/register` Request Body:**
```json
{ "name": "string", "email": "string", "password": "string", "businessName": "string" }
```
**Response (201):** `{ success: true, data: { user, token } }`

**POST `/auth/login` Request Body:**
```json
{ "email": "string", "password": "string" }
```
**Response (200):** `{ success: true, data: { user, token } }`

---

#### Client Routes (`/api/v1/clients`) — All Protected

| Method | Endpoint | Description |
|---|---|---|
| POST | `/clients` | Create a new client |
| GET | `/clients` | List all clients for current user |
| GET | `/clients/:id` | Get single client by ID |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

**POST/PUT Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string" }
```

---

#### Invoice Routes (`/api/v1/invoices`) — All Protected

| Method | Endpoint | Description |
|---|---|---|
| POST | `/invoices` | Create invoice |
| GET | `/invoices` | List all invoices for current user |
| GET | `/invoices/:id` | Get single invoice |
| PUT | `/invoices/:id` | Update invoice |
| DELETE | `/invoices/:id` | Delete invoice |

**POST `/invoices` Request Body:**
```json
{
  "clientId": "ObjectId",
  "items": [{ "name": "string", "quantity": 1, "price": 100 }],
  "issuedDate": "ISO date string",
  "dueDate": "ISO date string",
  "notes": "optional string",
  "status": "pending"
}
```

Controller calculates `totalAmount` from items before saving.

### 4.5 Authentication & Authorization

**Strategy:** Stateless JWT authentication

**Flow:**
1. User submits credentials → `POST /auth/login`
2. Server verifies password with `bcrypt.compare()`
3. On success: generates JWT signed with `process.env.JWT_SECRET`, expiry `7d`
4. Returns `{ token, user }` — client stores token in localStorage
5. All subsequent protected requests include `Authorization: Bearer <token>`
6. `authMiddleware` verifies token, decodes `userId`, attaches `req.user` to request object
7. Controllers use `req.user._id` to scope all queries to the authenticated user

**Security:**
- Passwords stored as bcrypt hashes (saltRounds: 10)
- JWT signed with secret from environment variable (never hardcoded)
- JWT expiry: 7 days
- All database queries filter by `userId` to prevent cross-user data access

### 4.6 Controller Logic (Simple CRUD)

**All controllers follow this pattern:**

```js
// Example: Create Invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientId, items, issuedDate, dueDate, notes, status } = req.body;
    
    // Calculate total from items
    const totalAmount = items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    
    // Create invoice
    const invoice = await Invoice.create({
      userId: req.user._id,
      clientId,
      items,
      totalAmount,
      issuedDate,
      dueDate,
      notes,
      status: status || 'pending'
    });
    
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Rules:**
- Controllers receive requests, validate basic input, call Mongoose models, return responses
- No complex business logic, no auto-calculations beyond simple totals
- Status updates are manual (user changes status via PUT request)
- Keep everything readable and straightforward

### 4.7 Error Handling

**Simple try-catch in every controller:**

```js
try {
  // logic
  res.json({ success: true, data: result });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
```

**HTTP Status Codes Used:**
- `200` — OK
- `201` — Created
- `400` — Bad request
- `401` — Unauthorized
- `404` — Not found
- `500` — Server error

### 4.8 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong_random_secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 5. Design System

### 5.1 Design Philosophy

Veltrix follows a **dark, premium fintech design language**. Every screen must be understandable within 5 seconds. If a user cannot parse the main data on a screen in one glance, the design fails.

**Principles:**
- Clarity over decoration
- Strong visual hierarchy (primary > secondary > tertiary data)
- Minimal cognitive load
- Professional trust — feels like a real SaaS product

### 5.2 Color System

#### Base Background Colors (Tailwind custom tokens)

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0F0F0F` | Main page background |
| `bg-secondary` | `#1A1A1A` | Cards, panels, sidebars |
| `bg-tertiary` | `#202020` | Elevated surfaces, input backgrounds |
| `border` | `#2A2A2A` | Dividers, card outlines, input borders |

#### Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#4F46E5` | Primary buttons, active states, chart main line, links |
| `success` | `#22C55E` | "Paid" badges, positive indicators, success toasts |
| `warning` | `#F59E0B` | "Pending" badges, caution states, warning toasts |
| `danger` | `#EF4444` | "Overdue" badges, error states, destructive actions |

#### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#E5E7EB` | Main body text, headings |
| `text-secondary` | `#9CA3AF` | Labels, subtitles, secondary info |
| `text-muted` | `#6B7280` | Metadata, timestamps, placeholder text |

#### Color Usage Rules

- **Never use more than 4–5 colors** on a single screen
- Financial amounts (₹, $, totals) must use `text-primary` at larger, bolder sizes
- Status is always communicated via the badge color system — never text alone
- Avoid using `danger` red for non-error states

### 5.3 Typography

**Font Family:** Inter (Google Fonts) → fallback: `system-ui, -apple-system, sans-serif`

**Type Scale:**

| Name | Size | Weight | Usage |
|---|---|---|---|
| Heading XL | 28–32px | 600 (SemiBold) | Page titles, hero headline |
| Heading L | 22–24px | 600 | Section headings |
| Heading M | 18–20px | 500 (Medium) | Card titles, modal headers |
| Body | 14–16px | 400 (Regular) | Default body text |
| Caption | 12–13px | 400 | Metadata, timestamps, helper text |

**Typography Rules:**
- Financial numbers (amounts, totals): **bold + larger than label** — creates hierarchy
- Labels above numbers: smaller size + `text-secondary` color
- Never use long paragraphs in the dashboard — use concise labels and values
- Avoid text smaller than 12px

### 5.4 Spacing System (8px Grid)

| Token | Value | Tailwind Equivalent |
|---|---|---|
| `xs` | 8px | `p-2`, `gap-2` |
| `sm` | 12px | `p-3`, `gap-3` |
| `md` | 16px | `p-4`, `gap-4` |
| `lg` | 24px | `p-6`, `gap-6` |
| `xl` | 32px | `p-8`, `gap-8` |
| `2xl` | 48px | `p-12`, `gap-12` |

**Rules:**
- Card internal padding: 20–24px (`p-5` or `p-6`)
- Gap between sections: 32px minimum
- All spacing must be a multiple of 8px
- Consistency is mandatory — no arbitrary pixel values

### 5.5 Layout System

- **Container max-width:** 1440px, centered
- **Sidebar width:** 220–240px, fixed position
- **Topbar height:** ~70px
- **Grid:** 12-column layout with equal gutters
- **Page content area:** flexbox or CSS grid, responsive breakpoints at 768px and 1280px

### 5.6 Component Styling Specifications

#### Cards

```
background:  #1A1A1A (bg-secondary)
border:      1px solid #2A2A2A
border-radius: 16px
padding:     20–24px
```

**Variants:**
- **Primary card** — used for key metrics (summary cards on dashboard)
- **Secondary card** — supporting info, list items, form containers

#### Buttons

**Primary Button:**
```
background:    #4F46E5
color:         #FFFFFF
border-radius: 12px
padding:       10px 20px
hover:         brightness slightly increased + subtle purple glow (box-shadow)
transition:    150ms ease-in-out
```

**Secondary Button:**
```
background:    transparent
border:        1px solid #2A2A2A
color:         #E5E7EB
hover:         background: #202020
```

**States:** default · hover · active · disabled · loading (spinner inside button)

#### Inputs

```
background:    #202020 (bg-tertiary)
border:        1px solid #2A2A2A
border-radius: 10px
color:         #E5E7EB
padding:       10px 14px
focus:         border-color → #4F46E5, subtle glow ring
error:         border-color → #EF4444
placeholder:   #6B7280
```

#### Tables

- **Header row:** background `#202020`, text `#9CA3AF`, font-weight 500
- **Body rows:** background `#1A1A1A`, text `#E5E7EB`, border-bottom `1px solid #2A2A2A`
- **Row hover:** background slightly lighter `#202020`
- **Minimal borders** — horizontal dividers only, no vertical lines
- **Status badges** inline in status column

#### Status Badges

```
Paid:     background #22C55E/20, color #22C55E, border-radius 9999px, padding 2px 10px
Pending:  background #F59E0B/20, color #F59E0B
Overdue:  background #EF4444/20, color #EF4444
```
(20 = 20% opacity background — creates soft pill badge effect)

#### Sidebar

```
background:    #1A1A1A
width:         220–240px
border-right:  1px solid #2A2A2A
```

**Nav item states:**
- Default: `text-secondary`, transparent background
- Hover: subtle background `#202020`
- Active: `primary` accent color text OR `primary/10` highlighted background + left accent border

### 5.7 Data Visualization

**Recharts configuration defaults:**
- Chart background: transparent
- Grid lines: minimal, color `#2A2A2A`
- Primary data: `#4F46E5` (indigo)
- Secondary data: `#9CA3AF` (muted)
- Smooth curves (`type="monotone"` for line/area charts)
- Tooltip: dark card style matching bg-secondary
- Legend: minimal, positioned outside chart area

**Rules:**
- No default chart styling — always override Recharts defaults
- Avoid cluttered axes — show minimal tick labels
- Animate on mount (Recharts `isAnimationActive={true}`)

### 5.8 Effects & Interactions

| Element | Effect |
|---|---|
| Cards hover | Slight elevation (translate-y -1px) + soft shadow |
| Buttons hover | Brightness +5% + subtle glow on primary |
| Sidebar nav hover | Smooth background color transition |
| Page transitions | Framer Motion `fadeIn` 150–250ms |
| Modal open/close | Framer Motion scale + fade |
| Toast notifications | Slide in from top-right, auto-dismiss 4s |
| Skeleton loaders | Pulse animation, matching layout of actual content |

**Transition standard:** `duration: 150–250ms`, `easing: ease-in-out`

### 5.9 What to Avoid

- More than 4–5 colors on a single screen
- Overlapping or cluttered layout elements
- Heavy drop shadows (subtle only)
- Tiny text below 12px
- Inline hardcoded colors — always use Tailwind config tokens
- Mixing frontend and backend concerns in components
- Inconsistent spacing (non-multiples of 8px)

### 5.10 Tailwind Configuration

Define all custom tokens in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      'bg-primary':   '#0F0F0F',
      'bg-secondary': '#1A1A1A',
      'bg-tertiary':  '#202020',
      'border-dark':  '#2A2A2A',
      'primary':      '#4F46E5',
      'success':      '#22C55E',
      'warning':      '#F59E0B',
      'danger':       '#EF4444',
      'text-primary': '#E5E7EB',
      'text-secondary':'#9CA3AF',
      'text-muted':   '#6B7280',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      card: '16px',
      button: '12px',
      input: '10px',
    }
  }
}
```

**Rule:** Never use hardcoded hex values in component JSX. Always reference Tailwind tokens.

---

## 6. GitHub & DevOps

### 6.1 Repository Structure

```
Veltrix/
├── client/              # React frontend (Vite + Tailwind)
├── server/              # Node.js backend (Express + MongoDB)
├── docs/
│   ├── frontend.md
│   ├── backend.md
│   ├── theme.md
│   └── github.md
├── README.md
└── .gitignore
```

### 6.2 Branching Strategy

**Branches:**

| Branch | Purpose | Rules |
|---|---|---|
| `main` | Stable, production-ready | Never commit directly; only via merged PRs |
| `feature/<name>` | All development work | One logical change per branch |
| `fix/<bug>` | Bug fixes | Branched from main |
| `docs/<topic>` | Documentation only | Branched from main |

**Branch Naming Examples:**
- `feature/readme-setup`
- `feature/frontend-structure`
- `feature/backend-structure`
- `feature/auth-system`
- `feature/dashboard-ui`
- `feature/invoice-module`
- `fix/auth-bug`
- `docs/update-readme`

### 6.3 Commit Message Convention

Format: `<type>: <short description>`

| Type | Meaning |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `chore` | Setup / config |
| `refactor` | Code improvement |
| `style` | UI changes |
| `test` | Testing |
| `perf` | Performance optimization |

**Good examples:**
```
feat: setup frontend structure
feat: add invoice API endpoints
docs: update README with setup steps
chore: configure tailwind css
refactor: improve client service logic
style: update dashboard card layout
perf: optimize frontend bundle size
```

**Bad examples (never use):** `done`, `update`, `final`, `xyz`, `stuff`

### 6.4 Pull Request Guidelines

**PR Title Format:** `<type>: <clear description>`

**PR Description Template:**
```markdown
## 📌 Summary
Brief explanation of what this PR does.

## 🚀 Changes
- Added frontend folder structure
- Configured Tailwind CSS

## 🧠 Notes
- No UI implemented yet
- Only setup changes

## ✅ Checklist
- [ ] Code works correctly
- [ ] No console errors
- [ ] Follows project structure
- [ ] Meaningful commit messages
- [ ] No unnecessary files
```

**Pre-merge Review Checklist:**
- Code is clean and readable
- No unnecessary files or dead code
- Proper naming conventions followed
- No console.log statements (unless intentional)
- Folder structure is followed
- No direct push to `main`

### 6.5 PR Roadmap (Implementation Plan)

**Phase 1 — Setup**

| PR | Branch | Title |
|---|---|---|
| 1 | `docs/readme` | `docs: add README` |
| 2 | `feature/frontend-structure` | `feat: frontend structure` |
| 3 | `feature/backend-structure` | `feat: backend structure` |

**Phase 2 — Core Features (CRUD)**

| PR | Branch | Title |
|---|---|---|
| 4 | `feature/auth-system` | `feat: authentication system` |
| 5 | `feature/clients-crud` | `feat: clients CRUD` |
| 6 | `feature/invoices-crud` | `feat: invoices CRUD` |

**Phase 3 — UI & Dashboard**

| PR | Branch | Title |
|---|---|---|
| 7 | `feature/dashboard-ui` | `feat: dashboard UI` |
| 8 | `feature/landing-page` | `feat: landing page` |
| 9 | `style/ui-improvements` | `style: UI improvements` |

### 6.6 Advanced GitHub Practices (Recommended)

- **GitHub Labels:** `feature`, `bug`, `documentation`, `enhancement`
- **Draft PRs:** Use for work-in-progress features not ready for review
- **Self-Review Comments:** Add PR comments explaining key decisions
- **Descriptive PR reviews:** Document what changed and why

---

## 7. Integration Points

### 7.1 Internal Module Communication

| Trigger | Effect |
|---|---|
| Invoice created | Controller calculates `totalAmount` from items array and saves |
| Invoice updated | Controller recalculates `totalAmount` if items changed |
| Invoice deleted | Simple deletion — no cascading updates |
| Auth login | Returns JWT; frontend stores in localStorage, attaches to all subsequent requests |

### 7.2 External Services

| Service | Purpose | Notes |
|---|---|---|
| **MongoDB Atlas** | Cloud database hosting | Connection via `MONGODB_URI` env var |
| **Google Fonts — Inter** | Typography | CDN import in HTML head |

### 7.3 Future Integrations (Not Required for MVP)

| Integration | Purpose |
|---|---|
| Payment gateway (Razorpay/Stripe) | Live payment processing |
| Email service (SendGrid/Resend) | Invoice email delivery |

---

## 8. Non-Functional Requirements

### 8.1 Performance

- **Frontend:**
  - All `/app/*` routes lazy-loaded
  - Skeleton loaders for better UX
  - Simple optimizations with `useMemo` where needed

- **Backend:**
  - MongoDB indexes on `userId`, `createdAt` for fast queries
  - Use `.lean()` on Mongoose queries for better performance
  - Keep queries simple and scoped to current user

- **Target response times:** API responses under 500ms for CRUD operations

### 8.2 Scalability

- **Backend architecture** is simple and easy to extend
- **MongoDB Atlas** handles scaling automatically
- **Stateless JWT** — no server-side session storage; supports multiple server instances
- **Frontend** — code splitting per route; CDN-deployable

### 8.3 Security

| Requirement | Implementation |
|---|---|
| Password storage | bcrypt with saltRounds: 10 |
| Authentication | JWT signed with strong secret, 7-day expiry |
| Data isolation | All queries scoped to `req.user._id` |
| CORS | Configured to allow only `CLIENT_URL` origin |
| Environment secrets | dotenv; secrets never committed to Git |
| HTTPS | Enforced in production deployment |

### 8.4 Maintainability

- **Consistent file structure** — every developer (or AI agent) can navigate by convention
- **No business logic in controllers or routes** — always in services layer
- **No hardcoded values** — colors in Tailwind config, API URLs in env vars, constants in `utils/`
- **Reusable component system** — every UI element is a shared component
- **Meaningful commit history** — follows conventional commits; history is readable without comments
- **Documentation** — all four `docs/` files maintained alongside code

---

## 9. Edge Cases & Constraints

### 9.1 Authentication Edge Cases

- **Expired JWT:** Response interceptor catches 401, clears localStorage, redirects to `/login`
- **Invalid JWT format:** `authMiddleware` returns 401
- **Duplicate email on register:** MongoDB unique index raises error; controller catches and returns 409

### 9.2 Invoice Edge Cases

- **Zero-item invoice:** Frontend validation prevents submission
- **Due date before issue date:** Frontend validation rejects this
- **Deleting an invoice:** Simple deletion with confirmation dialog
- **Status changes:** User manually updates status via edit form

### 9.3 Client Edge Cases

- **Deleting client with invoices:** Allow deletion; invoices remain (show "Client Deleted" instead of name)
- **Client with no invoices:** Show "No invoices yet" empty state

### 9.4 Frontend Constraints

- **No direct localStorage manipulation** in React components — route through Redux actions
- **No console.log in production** — remove before final commit
- **Theme token discipline** — never use raw hex values in JSX; always Tailwind class
- **Form state reset** — forms must reset on modal close to prevent stale data

### 9.5 Backend Constraints

- **No business logic in routes** — all logic in controllers
- **Never expose password hash** — exclude `password` field from all user response objects using `.select('-password')`
- **MongoDB connection pooling** — handled by Mongoose; do not create multiple connections
- **Environment validation on startup** — check all required env vars exist; crash early if missing

---

## 10. Implementation Guidelines for AI

This section provides a strict, ordered implementation plan for an AI agent building Veltrix from scratch.

### Phase 0 — Repository Bootstrap

1. Create `docs/` folder
2. Ensure all documentation files are present
3. Create `README.md` with project overview, tech stack, features
4. Create `.gitignore` (Node.js + React defaults)
5. Commit: `docs: add README`
6. Push to `docs/readme` branch → create PR to `main`

### Phase 1 — Backend Setup

7. Inside `server/`, run `npm init -y`
8. Install dependencies: `npm install express mongoose dotenv bcryptjs jsonwebtoken cors`
9. Create folder structure:
   ```
   src/
   ├── config/db.js
   ├── models/User.js, Client.js, Invoice.js
   ├── controllers/authController.js, clientController.js, invoiceController.js
   ├── routes/authRoutes.js, clientRoutes.js, invoiceRoutes.js, index.js
   ├── middleware/authMiddleware.js
   ├── app.js
   └── server.js
   ```
10. Create `.env` with all variables from §4.8
11. Implement `config/db.js` — Mongoose connection
12. Implement `app.js` — Express setup with CORS, JSON parser, routes
13. Implement `server.js` — connect DB, start server
14. Commit: `feat: backend structure`

### Phase 2 — Frontend Setup

15. Inside `client/`, run `npm create vite@latest . -- --template react`
16. Install: `npm install react-router-dom @reduxjs/toolkit react-redux axios react-hook-form yup framer-motion recharts tailwindcss postcss autoprefixer`
17. Setup Tailwind: `npx tailwindcss init -p`
18. Configure `tailwind.config.js` with all tokens from §5.10
19. Create folder structure from §3.2 (all folders with placeholder files)
20. Setup React Router in `App.jsx` with routes from §3.3
21. Create `ProtectedRoute` component
22. Setup Redux store with 5 empty slices
23. Create Axios instance with JWT interceptor
24. Commit: `feat: frontend structure`

### Phase 3 — Authentication (Backend)

25. Create `User` model (§4.3)
26. Implement `authController`:
    - `register` → hash password, create user, generate JWT
    - `login` → verify password, generate JWT
    - `getMe` → return user (exclude password)
27. Implement `authMiddleware` → verify JWT, attach `req.user`
28. Create `authRoutes.js` → `/register`, `/login`, `/me`
29. Test auth endpoints
30. Commit: `feat: authentication system (backend)`

### Phase 4 — Authentication (Frontend)

31. Create `authSlice` with `loginThunk`, `registerThunk`, `logoutThunk`
32. Create `authService.js` with Axios calls
33. Build `LoginPage` and `SignupPage` with forms
34. Implement token storage in localStorage on login
35. Test login → token → protected route flow
36. Commit: `feat: authentication system (frontend)`

### Phase 5 — Clients CRUD

37. Create `Client` model (§4.3)
38. Implement `clientController`:
    - `createClient`, `getClients`, `getClient`, `updateClient`, `deleteClient`
    - Each scoped to `req.user._id`
39. Create `clientRoutes.js`
40. Frontend: `clientSlice`, `clientService`, `ClientsPage` with form
41. Commit: `feat: clients CRUD`

### Phase 6 — Invoices CRUD

42. Create `Invoice` model (§4.3)
43. Implement `invoiceController`:
    - `createInvoice` → calculate `totalAmount` from items
    - `getInvoices`, `getInvoice`, `updateInvoice`, `deleteInvoice`
44. Create `invoiceRoutes.js`
45. Frontend: `invoiceSlice`, `invoiceService`, `InvoicesPage` with line items form
46. Commit: `feat: invoices CRUD`

### Phase 7 — Dashboard UI

47. Create UI components: Button, Input, Card, Modal, Table, Badge, Loader
48. Create Sidebar and Navbar layouts
49. Build `DashboardPage`:
    - Summary cards (count invoices by status)
    - Recent invoices table
    - Simple bar chart (optional)
50. Wire Redux thunks for data fetching
51. Add skeleton loaders
52. Commit: `feat: dashboard UI`

### Phase 8 — Landing Page

53. Build `LandingPage` with:
    - Hero section
    - Features cards
    - Problem/Solution section
    - CTA buttons → `/signup`
54. Make responsive
55. Commit: `feat: landing page`

### Phase 9 — Polish

56. Add Framer Motion transitions
57. Implement toast notifications
58. Add empty states for all lists
59. Verify all colors use Tailwind tokens
60. Remove console.log statements
61. Test full flow: register → login → create client → create invoice
62. Commit: `style: UI improvements`

### AI Implementation Rules

- **Follow phases in order** — don't skip steps
- **Build backend first** for each feature, then wire frontend
- **Keep it simple** — no complex business logic, just CRUD
- **All queries scoped to `req.user._id`**
- **Status updates are manual** — user changes via PUT request
- **Calculate totals in controllers**, not in models
- **No auto-calculations or triggers** — keep everything explicit
- **Empty states are required** for every list view
- **Use Tailwind tokens only** — no hardcoded hex values

---

_End of Veltrix PRD v1.0 (Simplified CRUD)_