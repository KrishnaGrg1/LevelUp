# 🏗️ LevelUp Frontend Architecture

## Overview

This document outlines the enterprise-grade architecture of the LevelUp frontend application, built with Next.js 15, TypeScript, Zustand, and TanStack Query.

## Architecture Principles

1. **Feature-Based Organization** - Code organized by domain/feature, not technical layer
2. **Separation of Concerns** - Clear boundaries between UI, business logic, and data
3. **Type Safety** - Comprehensive TypeScript usage with strict mode
4. **Scalability** - Modular structure that grows with the application
5. **Maintainability** - Consistent patterns and conventions
6. **Testability** - Code designed for easy testing

## Project Structure

```
levelup-frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── [lang]/           # Language-based routing
│   │   │   ├── (auth)/       # Authentication pages
│   │   │   ├── (home)/       # Dashboard pages
│   │   │   └── (landing)/    # Public landing pages
│   │   ├── globals.css       # Global styles
│   │   └── layout.tsx        # Root layout
│   │
│   ├── features/             # ⭐ Feature-based modules
│   │   ├── auth/             # Authentication feature
│   │   │   ├── api/          # Auth API calls
│   │   │   ├── components/   # Auth-specific components
│   │   │   ├── hooks/        # Auth hooks (useLogin, useRegister)
│   │   │   ├── stores/       # Auth Zustand store
│   │   │   ├── types/        # Auth TypeScript types
│   │   │   ├── utils/        # Auth utilities
│   │   │   └── index.ts      # Public exports
│   │   │
│   │   ├── user/             # User management feature
│   │   │   ├── api/          # User API calls
│   │   │   ├── components/   # User components
│   │   │   ├── hooks/        # User hooks
│   │   │   └── types/        # User types
│   │   │
│   │   ├── community/        # Community feature
│   │   └── quest/            # Quest feature
│   │
│   ├── shared/               # Shared utilities and components
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   │   └── common/      # Common components
│   │   │
│   │   ├── hooks/           # Shared hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # Shared TypeScript types
│   │
│   ├── core/                # Core application logic
│   │   ├── api/             # API client configuration
│   │   │   ├── client.ts    # Axios instance
│   │   │   ├── interceptors.ts
│   │   │   └── types.ts     # API response types
│   │   │
│   │   ├── config/          # App configuration
│   │   │   ├── constants.ts
│   │   │   ├── env.ts       # Environment variables
│   │   │   └── query-client.ts
│   │   │
│   │   └── providers/       # Global providers
│   │       ├── QueryProvider.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/                 # External integrations
│   │   ├── generated.ts     # API types (from backend)
│   │   └── utils.ts         # Utility functions
│   │
│   └── translations/        # i18n translations
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── config files...
```

## Feature Module Structure

Each feature module follows this structure:

```
features/[feature-name]/
├── api/                    # API layer
│   ├── queries.ts         # React Query hooks (useGetX, useListX)
│   ├── mutations.ts       # Mutation hooks (useCreateX, useUpdateX)
│   └── services.ts        # Raw API calls
│
├── components/            # Feature-specific components
│   ├── FeatureList.tsx
│   ├── FeatureDetail.tsx
│   └── FeatureForm.tsx
│
├── hooks/                 # Feature-specific hooks
│   ├── useFeature.ts
│   └── useFeatureValidation.ts
│
├── stores/               # Zustand stores
│   └── featureStore.ts
│
├── types/                # TypeScript types
│   ├── index.ts
│   └── schema.ts         # Zod schemas
│
├── utils/                # Feature utilities
│   └── helpers.ts
│
└── index.ts              # Public API exports
```

## Data Flow

```
┌─────────────┐
│   UI Layer  │ (Components)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Hooks Layer │ (React Query + Zustand)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  API Layer  │ (Services)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ HTTP Client │ (Axios)
└─────────────┘
```

## State Management Strategy

### Zustand (Client State)

- **Use for**: UI state, user preferences, session data
- **Location**: `features/[feature]/stores/`
- **Pattern**: Slice pattern with selectors

### TanStack Query (Server State)

- **Use for**: API data, caching, synchronization
- **Location**: `features/[feature]/api/`
- **Pattern**: Custom hooks per feature

### Local State (React useState)

- **Use for**: Component-specific state, forms
- **Location**: Within components

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.types.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Functions

- **React Components**: PascalCase
- **Hooks**: camelCase with 'use' prefix
- **Utilities**: camelCase
- **API calls**: camelCase with verb prefix (e.g., `getUser`, `createPost`)

### Variables

- **Constants**: UPPER_SNAKE_CASE
- **Regular variables**: camelCase
- **Private properties**: prefix with underscore

## Code Organization Best Practices

### 1. Feature Encapsulation

Each feature should be self-contained and export only what's needed:

```typescript
// features/auth/index.ts
export { LoginForm, RegisterForm } from './components';
export { useLogin, useRegister } from './hooks';
export { authStore } from './stores';
export type { LoginCredentials, User } from './types';
```

### 2. API Layer

Separate concerns between raw API calls and React Query hooks:

```typescript
// features/auth/api/services.ts
export const authService = {
  login: (credentials: LoginCredentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
};

// features/auth/api/mutations.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    // ... configuration
  });
};
```

### 3. Type Safety

Define types at feature level and share via index exports:

```typescript
// features/auth/types/index.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### 4. Store Organization

Use slice pattern for complex stores:

```typescript
// features/auth/stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(set => ({
  // state
  user: null,
  isAuthenticated: false,

  // actions
  setUser: user => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## Testing Strategy

### Unit Tests

- **Location**: Co-located with source files (e.g., `Button.test.tsx`)
- **Scope**: Individual functions, components, hooks
- **Tool**: Vitest + React Testing Library

### Integration Tests

- **Location**: `tests/integration/`
- **Scope**: Feature workflows, API integration
- **Tool**: Vitest + MSW (Mock Service Worker)

### E2E Tests

- **Location**: `tests/e2e/`
- **Scope**: Critical user flows
- **Tool**: Playwright

## Performance Considerations

1. **Code Splitting**: Use dynamic imports for heavy features
2. **Lazy Loading**: Defer non-critical components
3. **Memoization**: Use `useMemo` and `useCallback` judiciously
4. **Query Optimization**: Configure appropriate `staleTime` and `cacheTime`
5. **Bundle Analysis**: Regular bundle size monitoring

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **API Security**: Use CSRF tokens, secure cookies
3. **Input Validation**: Validate on client and server
4. **XSS Prevention**: Sanitize user input
5. **HTTPS**: Always use secure connections

## Migration Path

To migrate to this architecture:

1. ✅ Set up new directory structure
2. ✅ Configure TypeScript paths
3. ✅ Migrate Zustand stores
4. ✅ Refactor API client
5. ✅ Move features to new structure
6. ✅ Update imports throughout app
7. ✅ Add tests
8. ✅ Update documentation

## Further Reading

- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
