# Frontend – Affordable Residential Recommendation Chatbot

React + TypeScript + Vite + Tailwind CSS frontend with a modular structure.

## Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── layout/      # Header, Footer, etc.
│   └── ui/          # Buttons, inputs, cards
├── config/          # App configuration
├── constants/       # App constants
├── features/        # Feature-based modules (chat, properties, etc.)
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts (MainLayout, AuthLayout)
├── pages/           # Route-level page components
├── routes/          # Route definitions and router
├── services/        # API client and API calls
├── styles/          # Global CSS, Tailwind entry
├── types/           # TypeScript types
├── utils/           # Helper functions
├── App.tsx
└── main.tsx
```

## Setup

```bash
cd frontend
npm install
npm run dev
```

- **Dev:** http://localhost:5173  
- **Build:** `npm run build`  
- **Preview:** `npm run preview`

## Path alias

Use `@/` for `src/`:

- `import { Button } from '@/components/ui'`
- `import { APP_CONFIG } from '@/config'`

## Env

Create `.env` and set:

- `VITE_API_BASE_URL` – backend API base URL (default: `/api`, proxied to backend in dev)
