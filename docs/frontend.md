# 🎨 Frontend Architecture — Veltrix (MERN)

## 🧠 Frontend Philosophy

Veltrix frontend is designed to be:

* **Instantly understandable (≤ 5 seconds)**
* **Visually premium (FinTech SaaS level)**
* **Highly modular & scalable**
* **Mobile-first but desktop-optimized**

The UI must feel:

> “Powerful financial control, without complexity”

---

# 🏗️ 1. Tech Stack

## Core

* React (Vite)
* Tailwind CSS
* Redux Toolkit
* React Router DOM

## Supporting

* Axios (API layer)
* React Hook Form / Formik + Yup
* Framer Motion (animations)
* Recharts (charts)

---

# 📁 2. Folder Structure

```id="f1x9zs"
src/
│
├── components/          # Reusable UI
│   ├── ui/              # buttons, cards, inputs
│   ├── layout/          # sidebar, navbar
│   ├── charts/
│
├── pages/
│   ├── public/          # landing, auth
│   ├── dashboard/       # main app screens
│
├── features/            # redux slices
├── hooks/
├── services/            # API calls
├── utils/
├── App.jsx
└── main.jsx
```

---

# 🧭 3. Routing Structure

```id="r3k2nm"
/ (Landing Page)

/login
/signup

/app (Protected)
  ├── /dashboard
  ├── /invoices
  ├── /clients
  ├── /payments
  ├── /analytics
  └── /settings
```

## Route Types

* Public → Landing, Login, Signup
* Protected → Dashboard (JWT required)

---

# 🌐 4. LANDING PAGE (CRITICAL)

## 🎯 Goal

Convert visitors → users

## Sections

---

## 🟣 Hero Section

Content:

* Headline:

  > “Your Business Finances. Finally Clear.”
* Subtext:

  > “Track invoices, payments, and cash flow in one simple dashboard.”
* CTA:

  * “Get Started Free”
  * “See Demo”

UI:

* Dark gradient background
* Big typography
* Product mockup (dashboard preview)

---

## 📊 Features Section

Cards (3–4):

* Smart Invoicing
* Payment Tracking
* Cash Flow Insights
* Client Management

Each card:

* Icon
* Short description

---

## ⚡ Problem → Solution Section

Before:

* WhatsApp
* Excel
* UPI chaos

After:

* One clean dashboard

---

## 📈 Visual Showcase

* Dashboard preview
* Invoice screen
* Analytics

---

## 💬 Testimonials (optional)

* Fake but realistic quotes

---

## 🚀 CTA Section

* “Start managing your finances in minutes”
* Button → Signup

---

# 🔐 5. AUTH PAGES (LOGIN / SIGNUP)

## 🎯 Goal

Zero friction onboarding

---

## Layout

Split screen:

### LEFT:

* Branding
* Tagline
* Illustration / gradient

### RIGHT:

* Form card

---

## 🧾 Login Page

Fields:

* Email
* Password

Extras:

* “Remember me”
* “Forgot password”

CTA:

* Login button
* Link → Signup

---

## 📝 Signup Page

Fields:

* Name
* Email
* Password
* Business Name

CTA:

* Create Account

---

## UX Rules

* Inline validation
* Clear error messages
* Fast feedback
* Minimal fields

---

# 🏠 6. DASHBOARD (MAIN APP)

## Sections

---

## 📊 Summary Cards

* Revenue
* Pending
* Overdue
* Monthly

---

## 📈 Charts

* Cash flow graph

---

## 📌 Payment Tracker

* Kanban (Pending / Paid / Overdue)

---

## 📋 Recent Invoices Table

---

# 🧾 7. INVOICE PAGE

* Form + live preview
* Add/remove items
* Real-time total

---

# 👥 8. CLIENT PAGE

* Card/grid layout
* Client stats

---

# 💳 9. PAYMENTS PAGE

* Table view
* Status badges

---

# 📊 10. ANALYTICS PAGE

* Trends
* Monthly charts

---

# ⚙️ 11. SETTINGS PAGE

* Profile
* Business details
* Preferences

---

# 🎨 12. COMPONENT SYSTEM

## Must Reusable Components

* Button
* Input
* Card
* Modal
* Table
* Badge
* Loader

---

# 🔁 13. STATE MANAGEMENT (Redux)

## Slices

* authSlice
* userSlice
* invoiceSlice
* clientSlice
* uiSlice

---

# 🔌 14. API INTEGRATION

* Centralized Axios instance
* Interceptors:

  * attach token
  * handle errors

---

# ✨ 15. UX Enhancements

* Skeleton loaders
* Empty states
* Error UI
* Toast notifications

---

# ⚡ 16. PERFORMANCE

* Lazy loading routes
* useMemo / useCallback
* Code splitting

---

# 🌙 17. THEME SUPPORT

* Dark mode (default)
* Store preference in localStorage

---

# 📦 18. STORAGE

## localStorage

* auth token
* theme

## sessionStorage

* form progress

---

# 🔔 19. NOTIFICATIONS

* Success
* Error
* Alerts (overdue invoices)

---

# 📤 20. FILE UPLOAD

* Invoice logo
* Preview before upload

---

# 🎯 FINAL GOAL

Frontend should:

* Feel like a real SaaS product
* Be intuitive for non-technical users
* Match modern fintech UI standards

---

# ✅ OUTCOME

This frontend ensures:

* Full product experience (Landing → Auth → Dashboard)
* Strong UX
* Industry-ready architecture