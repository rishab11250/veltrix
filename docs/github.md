# 🧩 GitHub Workflow Guide — Veltrix (CRUD-Based MERN Project)

## 🧠 Purpose

This document defines the **GitHub workflow, branching strategy, and PR process** for Veltrix.

This project is built as a **simple MERN CRUD application**, so the workflow focuses on:

* clean structure
* small, focused PRs
* fast development
* clear commit history

---

# 🏗️ 1. Repository Structure

```bash
Veltrix/
├── client/        # React frontend
├── server/        # Express backend (CRUD APIs)
├── docs/          # Documentation files
│   ├── frontend.md
│   ├── backend.md
│   ├── theme.md
│   └── github.md
├── README.md
└── .gitignore
```

---

# 🌳 2. Branching Strategy

## Main Branch

* `main` → stable code only
* Updated ONLY via Pull Requests

---

## Feature Branches

All work must be done in:

```bash
feature/<task-name>
```

### Examples:

* `feature/readme`
* `feature/frontend-setup`
* `feature/backend-setup`
* `feature/auth`
* `feature/clients-crud`
* `feature/invoices-crud`
* `feature/dashboard`

---

## Rules

* Never commit directly to `main`
* One branch = one feature
* Keep branches small and focused

---

# 🔁 3. Development Workflow

## Step-by-Step

### 1. Create branch

```bash
git checkout -b feature/<task-name>
```

---

### 2. Work on feature

* Follow folder structure
* Keep code simple (CRUD only)

---

### 3. Commit changes

```bash
git add .
git commit -m "feat: <short description>"
```

---

### 4. Push branch

```bash
git push origin feature/<task-name>
```

---

### 5. Create Pull Request

* Base: `main`
* Compare: `feature/<task-name>`

---

### 6. Review & Merge

* Check code
* Fix issues if needed
* Merge PR

---

# 🧾 4. Commit Message Convention

Format:

```bash
<type>: <message>
```

---

## Types

| Type  | Meaning       |
| ----- | ------------- |
| feat  | New feature   |
| fix   | Bug fix       |
| docs  | Documentation |
| chore | Setup/config  |
| style | UI changes    |

---

## ✅ Good Examples

```bash
feat: setup frontend structure
feat: add client CRUD APIs
feat: implement invoice CRUD
docs: add README
chore: setup express server
```

---

## ❌ Bad Examples

```bash
done
update
final
```

---

# 🔀 5. Pull Request Guidelines

## PR Title

```bash
<type>: <description>
```

### Examples:

* `docs: add README`
* `feat: setup backend structure`
* `feat: implement clients CRUD`

---

## PR Description Template

```md
## 📌 Summary
What this PR does

## 🚀 Changes
- Added client model
- Created CRUD routes
- Setup controllers

## 🧠 Notes
- Basic CRUD only
- No advanced logic

## ✅ Checklist
- [ ] Code runs
- [ ] No errors
- [ ] Follows structure
```

---

# 🧪 6. PR Roadmap (Assignment Plan)

## 🥇 Phase 1 — Setup

| PR | Title                    |
| -- | ------------------------ |
| 1  | docs: add README         |
| 2  | feat: frontend structure |
| 3  | feat: backend structure  |

---

## 🥈 Phase 2 — Core Features (CRUD)

| PR | Title                       |
| -- | --------------------------- |
| 4  | feat: authentication system |
| 5  | feat: clients CRUD          |
| 6  | feat: invoices CRUD         |

---

## 🥉 Phase 3 — UI & Dashboard

| PR | Title                  |
| -- | ---------------------- |
| 7  | feat: dashboard UI     |
| 8  | feat: landing page     |
| 9  | style: UI improvements |

---

# 📁 7. Code Organization Rules

* Frontend → `/client`
* Backend → `/server`
* Docs → `/docs`

---

# 🔐 8. Important Rules

* No direct push to `main`
* Always use PRs
* Keep PRs small
* Follow simple CRUD logic (no over-engineering)

---

# 🧠 9. Best Practices

* Commit frequently
* Keep messages meaningful
* Review before merging
* Keep code readable

---

# ⚠️ 10. What to Avoid

❌ Large PRs with multiple features
❌ Complex backend logic
❌ Mixing frontend/backend code
❌ Poor commit messages

---

# 🎯 Final Goal

The repository should:

* be clean and organized
* show structured development
* reflect a working CRUD MERN app

---

# ✅ Outcome

Following this workflow ensures:

* smooth development
* easy evaluation
* professional GitHub repo
