# ⚡ KNOW AKS — Universal Digital Workspace & Productivity Suite

[![Production Live](https://img.shields.io/badge/Production-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://know-ai-workspace.vercel.app/dashboard)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbishekPranavGV%2Fknow-ai-workspace)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7_LibSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **KNOW AKS is an all-in-one universal digital productivity, communication, learning, and collaboration workspace. Built for students, professionals, freelancers, entrepreneurs, educators, and teams — with essential features permanently free.**

🌐 **Live Cloud Production Dashboard:** [https://know-ai-workspace.vercel.app/dashboard](https://know-ai-workspace.vercel.app/dashboard)

---

## 🚀 Live Deployment on Vercel

You can deploy your own instance of KNOW AKS to Vercel in 60 seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbishekPranavGV%2Fknow-ai-workspace)

### Vercel Deployment Steps:
1. Click the **Deploy with Vercel** button above or import repository `AbishekPranavGV/know-ai-workspace` in your [Vercel Dashboard](https://vercel.com/new).
2. Set Environment Variables (optional, defaults to embedded SQLite):
   - `NEXTAUTH_SECRET`: Random 32-character string (e.g. `openssl rand -base64 32`)
   - `DATABASE_URL`: Turso database URL (`libsql://...`) or default SQLite.
3. Click **Deploy**. Vercel will automatically run `prisma generate && next build` and deploy your live URL!

---

## 💻 Run as Native Desktop Software

KNOW AKS is engineered to run both as a web workspace and as **standalone desktop software**:

### Option 1: Native Windows Launcher (Zero Browser Tabs)
Double-click or run:
```cmd
.\know-aks-desktop.bat
```
Or with npm:
```bash
npm run desktop
```
This launches KNOW AKS in a dedicated, borderless desktop software window without address bars, navigation controls, or browser tab distractions.

### Option 2: 1-Click PWA Installation
1. Open the application in Google Chrome, Microsoft Edge, or Brave.
2. Click the **Install Icon** (`⊕`) in the right side of the address bar, or click **"Install Software"** inside the app topbar.
3. KNOW AKS will install directly to your Windows Start Menu, Taskbar, macOS Dock, or Linux desktop.

---

## 🌟 The 6 Core Pillars & 13 Modules

| Pillar | Modules | Highlights |
|---|---|---|
| **Productivity** | **Notes Studio**, **Tasks & Kanban**, **Calendar & Meet**, **Goals & OKRs**, **File Vault** | Split Markdown editor with live preview, sprint kanban board, instant Google Meet link generator, quantifiable OKR tracking, and file manager. |
| **Communication** | **Team Chat**, **Direct Messaging**, **Channels** | Multi-channel communication (`#general`, `#study-group`), direct messaging, PDF and image previews, and emoji feedback. |
| **Learning** | **Knowledge Base**, **Flashcards**, **Pomodoro** | SuperMemo SM-2 spaced repetition recall algorithm, rating scale (Again, Hard, Good, Easy), and Pomodoro study timer. |
| **Collaboration** | **Workspaces**, **Team RBAC** | Instant multi-workspace switcher, role-based access control (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`), and team invite flow. |
| **Integration** | **Google Hub**, **Webhooks**, **GitHub** | Connectors for Google Drive, Calendar, Meet, GitHub, and secure webhook integrations. |
| **Security & Privacy** | **Security Centre**, **Audit Trail**, **DPDP Portability** | India DPDP Act 2023 compliance, 30-day append-only audit trail, TOTP MFA authenticator, session revoker, and 1-click sanitized data archive export. |

---

## 🏗️ Technical Architecture

- **Framework**: Next.js 16 (App Router with Turbopack, Partial Prerendering)
- **UI Engine**: Tailwind CSS 4, Radix UI primitives, Lucide Icons, Aurora Mesh Gradients
- **Database**: Prisma 7 ORM with LibSQL / SQLite Driver Adapter (`@prisma/adapter-libsql`)
- **Authentication**: NextAuth.js v5 / Auth.js with local Bcrypt encryption
- **Deployment Target**: Vercel Serverless / Edge + Desktop Standalone Mode

---

## 🛠️ Local Development Quickstart

```bash
# 1. Clone repository
git clone https://github.com/AbishekPranavGV/know-ai-workspace.git
cd know-ai-workspace

# 2. Install dependencies
npm install

# 3. Synchronize database
npx prisma generate
npx prisma db push

# 4. Start local development server
npm run dev

# 5. Or build & run production server
npm run build
npm run start
```

Default demo login: `alex@example.com` / `Password123!`

---

## 👤 Author & Maintainer

**Abishek Pranav G V**  
- Portfolio: [https://abishekpranavgv.github.io/abishekpranavportfolio/](https://abishekpranavgv.github.io/abishekpranavportfolio/)  
- LinkedIn: [https://www.linkedin.com/in/abishek-pranav-g-v-/](https://www.linkedin.com/in/abishek-pranav-g-v-/)  
- GitHub: [https://github.com/AbishekPranavGV](https://github.com/AbishekPranavGV)
