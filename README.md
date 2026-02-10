# Tiket.ku - Event Ticketing Platform

A modern, high-performance event ticketing and management platform built with **Next.js 15**, **Tailwind CSS**, and **TanStack React Query**.

## 🚀 Overview

Tiket.ku is a comprehensive ticketing solution featuring a robust dashboard for platform administrators, event organizers, and staff.

- **Super Admin:** Manage events, admins, users, and platform-wide settings.
- **Event Admin:** Manage specific events, ticket types, orders, and reports.
- **Scan Staff:** Quick ticket verification via QR code scanning.

## 🛠 Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Notifications:** [Sonner](https://react-hot-toast.com/) (Toast)

## 📁 Project Structure

```text
src/
├── app/                    # Next.js App Router (Routes & Layouts)
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── login/              # Auth routes
│   └── layout.jsx          # Root layout & Providers
├── components/             # React Components
│   ├── common/             # Shared components (DataTable, Modal, etc.)
│   ├── features/           # Domain-specific logic (Superadmin, EventAdmin)
│   ├── ui/                 # Atomic UI components (shadcn/ui)
│   └── ...
├── contexts/               # React Contexts (Auth, etc.)
├── lib/                    # Shared utilities & API clients (Axios)
├── services/               # API Service layers
├── utils/                  # Helper functions
└── ...
```

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ticketku
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Duplicate `.env.example` to `.env` and fill in the required variables.

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💻 Development Scripts

- `npm run dev`: Start Next.js development server.
- `npm run build`: Create optimized production build.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint check.

## 📄 Key Features implemented in Migration

- ✅ **App Router Conversion:** Functional migration from Vite to Next.js 15.
- ✅ **Role-Based Access Control:** Secure layouts and components based on user roles.
- ✅ **Centralized Auth:** Integrated Cookie-based authentication with `AuthContext`.
- ✅ **Modernized Components:** All UI components updated for Next.js Server/Client component standards.
- ✅ **Optimized Build:** Clean project structure with `src/app` for better maintainability.

---

Tiket.ku - Built for performance and scalability.
