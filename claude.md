# Frontend Architecture & Developer Guide (`ss-hr-c-FE`)

Welcome to the frontend application for **SS Human Resource Consultancy** and **Full Stack Solutions**. This document serves as a persistent guide for AI assistants (such as Claude) and developers working on this codebase.

---

## 1. Project Overview & Role

- **Repository**: `ss-hr-c-FE`
- **Application**: Single Page Application (SPA) serving:
  1. **SS HR Consultancy Portal**: Job hunting packages, international visa & ticketing services, candidate job applications, staff duty tracking, and enquiries.
  2. **Full Stack Solutions (FSS) Admin**: B2B software & web development lead tracking, telecaller activity logging, AI lead summarization, and website audit report management.
- **Port**: Typically runs on `http://localhost:3000` (or `5173` depending on configuration).

---

## 2. Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**:
  - [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
  - [Radix UI](https://www.radix-ui.com/) headless component primitives (`@radix-ui/react-*`)
  - Icons: [Lucide React](https://lucide.dev/) and [Tabler Icons React](https://tabler.io/icons)
- **State Management**:
  - **Client & Auth State**: Redux Toolkit (`@reduxjs/toolkit`) + `redux-persist`
  - **Server State & Caching**: TanStack React Query v5 (`@tanstack/react-query`)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Forms & Validation**: React Hook Form + Zod (`@hookform/resolvers`)
- **Animations**: Framer Motion, GSAP, DotLottie / Lottie React
- **Document / Export Utilities**: `xlsx`, `jspdf`, `html2canvas`
- **Notifications**: `react-toastify`, `sonner`

---

## 3. Directory Layout (`src/`)

```
src/
├── assets/          # Static assets, logos, banners, illustrations
├── components/      # Reusable UI & domain-specific components
│   ├── admin/       # Admin-specific modals, panels (e.g., LeadActivityModal, WebsiteAuditReportPanel)
│   ├── common/      # Generic shared components (Header, Footer, Loaders)
│   ├── table/       # TanStack Table implementations, column definitions, data-table wrapper
│   └── ui/          # Radix-based UI components (dialog, popover, button, select, tabs, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility helpers (e.g., cn helper for clsx + tailwind-merge)
├── pages/           # Application route views
│   ├── admin/       # SuperAdmin & Staff dashboards, FullStackSolutionsPage, duties, etc.
│   ├── auth/        # Login, registration, password recovery views
│   ├── common/      # Error pages, 404, unauthorized
│   └── user/        # Public-facing candidate / client portal pages
├── router/          # Route configurations and protected route wrappers
├── store/           # Redux slices, store setup, persisted reducers
├── types/           # TypeScript interfaces, DTOs, domain models
└── utils/           # Utility functions & API integration
    ├── apis/        # Domain-scoped Axios API services (e.g. adminFullStackContactApi.ts)
    └── helpers/     # Formatting, date parsing, follow-up helpers
```

---

## 4. Key Workflows & Commands

Run all commands from within the `ss-hr-c-FE/` directory:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the Vite local dev server with HMR |
| **Production Build** | `npm run build` | Compiles TypeScript and builds production bundle via Vite |
| **Type Check** | `npm run type-check` | Runs `tsc --noEmit` to validate all TypeScript types |
| **Lint** | `npm run lint` | Runs ESLint across source files (ignores `src/components/ui`) |
| **Format** | `npm run format` | Auto-formats code with Prettier |
| **Preview Build** | `npm run preview` | Previews the production build locally |

---

## 5. Domain Rules & Core Conventions

### A. Full Stack Solutions (FSS) Module (`FullStackSolutionsPage.tsx`)
- **Access Control**:
  - Staff members only see their assigned leads.
  - "Tony" (Super Admin) can assign staff and view the assigned staff column.
- **Pagination**: Default limit is **8 contacts per page** with dynamic page buttons and range indicator (`Showing X to Y of Z contacts`).
- **Text Truncation**:
  - Always use `truncateText(str, max)` that slices the string and appends `...`. Never return standalone `...`.
  - For single-line text in table cells, pair with Tailwind `truncate whitespace-nowrap`.
- **Comments Column (`FSSCommentCell`)**:
  - Displays comments in a clean, single-line format (`max-w-[210px] truncate whitespace-nowrap`) with a fixed length ellipsis.
  - Clicking the cell or Eye icon opens a Popover (`@/components/ui/popover`) showing the full comment with scroll support and native browser tooltip.
- **AI Integration**:
  - `onSummarizeComment` calls the backend endpoint `/admin/full-stack-contacts/summarize-comment` which summarizes raw telecalling notes into B2B sales follow-ups (distinct from candidate interview summaries).

### B. State & API Mutation Patterns
- Always invalidate related TanStack Query cache keys on successful mutations (e.g., `queryClient.invalidateQueries({ queryKey: ["fss-contacts"] })`).
- Show user-friendly feedback using `toast.success` and handle error responses gracefully with `toast.error(err?.response?.data?.message || ...)`.

### C. UI & Styling Standards
- Prefer Tailwind utility classes over custom CSS.
- Ensure dark mode compatibility using `dark:` variant classes.
- Use `@/components/ui/*` Radix wrappers for accessible interactive elements (Dialogs, Popovers, Dropdowns).
