# ⚙️ Backend Architecture — Veltrix (Simplified CRUD Version)

## 🧠 Purpose

This backend is designed as a **basic CRUD API** for a MERN stack project.

It focuses on:

* simplicity
* clean structure
* easy frontend integration

No complex business logic or over-engineering is included.

---

# 🏗️ 1. Tech Stack

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT (for authentication)
* bcrypt (password hashing)
* dotenv (env variables)

---

# 📁 2. Folder Structure

```bash
server/
├── src/
│   ├── config/          # DB connection
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # auth middleware
│   ├── app.js
│   └── server.js
└── package.json
```

---

# 🔐 3. Authentication (Basic)

## Features

* Register user
* Login user
* JWT token generation

## Flow

1. User logs in/registers
2. Server returns JWT
3. Frontend sends token in headers:

   ```
   Authorization: Bearer <token>
   ```

---

# 🧩 4. Models (Simple)

---

## 👤 User

```js
{
  name: String,
  email: String,
  password: String,
  businessName: String,
  createdAt: Date
}
```

---

## 👥 Client

```js
{
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  createdAt: Date
}
```

---

## 🧾 Invoice

```js
{
  userId: ObjectId,
  clientId: ObjectId,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: String, // pending | paid | overdue
  issuedDate: Date,
  dueDate: Date,
  createdAt: Date
}
```

---

# 🔌 5. API Routes (CRUD Only)

## Base URL

```
/api/v1
```

---

## 🔐 Auth

```
POST /auth/register
POST /auth/login
GET  /auth/me
```

---

## 👥 Clients

```
POST   /clients        → Create client
GET    /clients        → Get all clients
GET    /clients/:id    → Get single client
PUT    /clients/:id    → Update client
DELETE /clients/:id    → Delete client
```

---

## 🧾 Invoices

```
POST   /invoices
GET    /invoices
GET    /invoices/:id
PUT    /invoices/:id
DELETE /invoices/:id
```

---

# 🧠 6. Controller Logic (Simple)

Each controller should:

* receive request
* call model
* return response

## Example Flow

```text
Request → Controller → Model → Response
```

---

## Example: Create Invoice

* take data from req.body
* calculate totalAmount
* save to DB
* return created invoice

---

# ⚠️ 7. Rules (Important)

* No complex business logic
* No analytics aggregation
* No automation (like auto status updates)
* Keep everything simple and readable

---

# 🔐 8. Middleware

## authMiddleware

* verify JWT
* attach user to request

---

# ⚡ 9. Error Handling

Basic error handling:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 📦 10. Optional (Only if time)

* simple pagination:

  ```
  /invoices?page=1&limit=10
  ```

---

# 🎯 Final Goal

The backend should:

* support frontend CRUD operations
* be clean and easy to understand
* work reliably for demo

---

# ✅ Outcome

This backend ensures:

* fast development
* fewer bugs
* easier debugging
* perfect for assignment requirements
