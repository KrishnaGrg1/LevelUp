
# LevelUp

LevelUp is a modern, multi-language SaaS starter built with Next.js 15, React 19, TypeScript, and Tailwind CSS. It features a modular landing page system, authentication flows, reusable UI components, and a scalable architecture for rapid product launches.

## 🚀 Features

- **Landing Pages**: Home, About, Features, Pricing, Contact — all modular, responsive, and analytics-ready.
- **Authentication**: Signup, Login, Password Reset, Email Verification — with Zod validation and React Hook Form.
- **Internationalization Ready**: Language-aware routing and structure, prepared for i18n.
- **Reusable UI Library**: 40+ custom and Radix UI-based components (buttons, dialogs, forms, tables, etc.).
 - **Reusable UI Library**: 40+ shadcn/ui components (built on Radix primitives) — buttons, dialogs, forms, tables, and more.
- **Modern Design System**: Gradients, glassmorphism, animated stats, testimonials, and more.
- **Performance & Accessibility**: Optimized for speed, SEO, and accessibility (semantic HTML, ARIA, keyboard nav).
- **State Management**: Zustand for global state, TanStack React Query for async data.
- **API Integration Ready**: Axios and service layer for backend communication.
- **Mobile-First**: Fully responsive, touch-friendly, and fast on all devices.

## 🗂️ Project Structure

```
src/
	app/
		[lang]/(landing)/[page]/page.tsx   # Landing pages (home, about, features, pricing, contact)
		[lang]/(auth)/[flow]/page.tsx       # Auth flows (login, signup, reset-password, verify)
		components/                         # All UI, landing, and auth components
		hooks/                              # Custom React hooks
		lib/                                # Utilities and API services
		stores/                             # Zustand stores
public/                                 # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS, shadcn/ui (Radix primitives), Styled Components
- **State**: Zustand, React Query
- **Forms**: React Hook Form, Zod
- **API**: Axios
- **Testing**: (Add your preferred tools)

## ⚡ Getting Started

Install dependencies:

```bash
pnpm install
# or
yarn install
# or
npm install
```

Run the development server:

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧩 Main Components

- `Navbar`, `Footer`, `LanguageSwitcher` — shared layout
- `HeroSection`, `FeaturesSection`, `StatsSection`, `TestimonialsSection`, `CTASection` — landing modules
- `Login`, `Register`, `TopBar`, `Verify` — authentication
- 40+ UI primitives in `components/ui/`

## 📄 Landing Pages

- `/[lang]/(landing)/home` — Main landing page
- `/[lang]/(landing)/about` — Company, mission, team
- `/[lang]/(landing)/features` — Feature showcase, integrations
- `/[lang]/(landing)/pricing` — Plan comparison, FAQ
- `/[lang]/(landing)/contact` — Contact form, support, FAQ

## 🔒 Authentication

- `/[lang]/(auth)/login` — Login form
- `/[lang]/(auth)/signup` — Registration
- `/[lang]/(auth)/forget-password` — Request password reset
- `/[lang]/(auth)/reset-password` — Set new password
- `/[lang]/(auth)/verify` — Email verification

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query](https://tanstack.com/query/latest)

---

© 2025 Krishna Bahadur Gurung. All rights reserved.
