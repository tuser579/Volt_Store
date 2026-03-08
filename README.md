# ⚡ Volt Store — Premium Electronics E-Commerce

A polished, full-featured e-commerce application built with **Next.js 15 App Router**, featuring authentication, protected routes, dark/light mode, smooth animations, and a premium Dark Tech UI theme.

---

## 🖥️ Live Demo

> Deploy to Vercel (see instructions below)

---

## ✨ Features

- 🔐 **Authentication** — NextAuth.js with Google OAuth + Credentials login
- 🛡️ **Protected Pages** — Add Product & Manage Products redirect to `/login` if unauthenticated
- 🌙 **Dark / Light Mode** — Toggle with `next-themes`, persists across sessions
- 🎞️ **Animations** — GSAP (hero), Framer Motion (page transitions, modals, cards), Lenis (smooth scroll)
- 📱 **Fully Responsive** — Mobile → Tablet → Laptop → Desktop
- 🔍 **Product Search & Filter** — Live search + category chips + sort
- 🗑️ **Manage Products** — View, delete with confirmation modal
- ✅ **Form Validation** — Inline errors, password strength meter, loading states
- 🍞 **Toast Notifications** — react-hot-toast for all actions

---

## 🎨 Theme — Dark Tech

```css
--bg:        #080c14   /* deep navy black   */
--primary:   #3b82f6   /* electric blue     */
--accent:    #06b6d4   /* cyan highlight    */
--success:   #22c55e
--warning:   #f59e0b
--danger:    #ef4444
```

Fonts: **Syne** (display) + **DM Sans** (body) + **JetBrains Mono** (code/labels)

---

## 🗂️ Route Summary

| Route                            | Access     | Description                        |
|----------------------------------|------------|------------------------------------|
| `/`                              | Public     | Landing page — 7 sections          |
| `/login`                         | Public     | Sign in (Google + Credentials)     |
| `/register`                      | Public     | Create account                     |
| `/products`                      | Public     | Product list with search & filter  |
| `/products/[id]`                 | Public     | Product detail page                |
| `/dashboard/add-product`         | 🔒 Protected | Add a new product form           |
| `/dashboard/manage-products`     | 🔒 Protected | Table/grid with View & Delete    |

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/volt-store.git
cd volt-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-secret-string

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Note:** Google OAuth is optional. The credentials login works without it.
> Demo login: any email + password `password123`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard

1. Push to GitHub: `git push -u origin main`
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in **Settings → Environment Variables**:
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
   - `NEXTAUTH_SECRET` = any secure random string
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)
4. Deploy ✅

---

## 📦 Tech Stack

| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| Next.js 15        | App Router, SSR, routing             |
| NextAuth.js v4    | Authentication (Google + Credentials)|
| Tailwind CSS v4   | Utility-first styling                |
| Framer Motion     | Page & component animations          |
| GSAP + ScrollTrigger | Hero animations, scroll effects   |
| Lenis             | Smooth scroll                        |
| next-themes       | Dark/light mode                      |
| react-hot-toast   | Toast notifications                  |
| lucide-react      | Icons                                |

---

## 📁 Project Structure

```
volt-store/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/route.js
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   ├── products/
│   │   │   ├── page.jsx
│   │   │   └── [id]/page.jsx
│   │   ├── dashboard/
│   │   │   ├── add-product/page.jsx
│   │   │   └── manage-products/page.jsx
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── not-found.jsx
│   │   └── globals.css
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   └── data/
│       └── products.js
├── .env.local.example
├── next.config.mjs
├── tailwind.config.js
├── jsconfig.json
└── README.md
```

---

## 🔑 Demo Credentials

```
Email:    any@email.com
Password: password123
```

---

## 📄 License

MIT © 2026 Volt Store
