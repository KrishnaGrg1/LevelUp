# 🚀 Developer Guide - LevelUp Frontend

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Naming Conventions](#naming-conventions)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Component Patterns](#component-patterns)
8. [Testing Guidelines](#testing-guidelines)
9. [Performance Best Practices](#performance-best-practices)
10. [Common Patterns](#common-patterns)

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Basic knowledge of TypeScript, React, and Next.js
- Familiarity with Zustand and TanStack Query

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linter
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test
```

---

## Project Structure

Our project follows a **feature-based architecture**:

```
src/
├── app/                # Next.js App Router pages
├── features/           # Feature modules (by domain)
├── shared/             # Shared components, hooks, utils
├── core/               # Core application logic
└── lib/                # External integrations
```

### Feature Module Structure

Each feature is self-contained:

```
features/[feature-name]/
├── api/                # API services and hooks
│   ├── services.ts     # Raw API calls
│   ├── queries.ts      # React Query hooks
│   ├── mutations.ts    # Mutation hooks
│   └── types.ts        # API types
├── components/         # Feature-specific components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
└── index.ts            # Public API
```

---

## Coding Standards

### TypeScript

- ✅ **Always use TypeScript** - No `any` types unless absolutely necessary
- ✅ **Enable strict mode** - Already configured in `tsconfig.json`
- ✅ **Use type inference** - Let TypeScript infer when obvious
- ✅ **Export types separately** - Use `export type` for type-only exports

```typescript
// ✅ Good
export type { User } from './types';
export { userService } from './services';

// ❌ Bad
export { User, userService } from './types';
```

### Imports

Follow the import order enforced by ESLint:

1. React and Next.js
2. External packages
3. Internal aliases (@/)
4. Relative imports
5. Type imports

```typescript
// ✅ Good
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/core/api';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui';

import { formatDate } from './utils';

import type { User } from './types';

// ❌ Bad - mixed order
import { Button } from '@/shared/components/ui';
import { useState } from 'react';
import type { User } from './types';
```

### Code Organization

```typescript
// Component file structure
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Helper functions
// 5. Component
// 6. Exports

import { useState } from 'react';
import type { FC } from 'react';

// Types
interface UserCardProps {
  user: User;
  onEdit: () => void;
}

// Constants
const MAX_NAME_LENGTH = 50;

// Helper (if small and only used here)
const truncateName = (name: string) => {
  return name.length > MAX_NAME_LENGTH
    ? `${name.slice(0, MAX_NAME_LENGTH)}...`
    : name;
};

// Component
export const UserCard: FC<UserCardProps> = ({ user, onEdit }) => {
  // Hooks first
  const [isHovered, setIsHovered] = useState(false);

  // Event handlers
  const handleClick = () => {
    onEdit();
  };

  // Render
  return (
    <div onClick={handleClick}>
      {truncateName(user.name)}
    </div>
  );
};
```

---

## Naming Conventions

### Files

| Type       | Convention               | Example            |
| ---------- | ------------------------ | ------------------ |
| Components | PascalCase               | `UserProfile.tsx`  |
| Hooks      | camelCase with `use`     | `useAuth.ts`       |
| Utils      | camelCase                | `formatDate.ts`    |
| Types      | PascalCase with `.types` | `User.types.ts`    |
| Constants  | UPPER_SNAKE_CASE         | `API_ENDPOINTS.ts` |
| Stores     | camelCase with `Store`   | `authStore.ts`     |

### Code

```typescript
// ✅ Components - PascalCase
export const UserProfile = () => {};
export const LoginForm = () => {};

// ✅ Hooks - camelCase with 'use' prefix
export const useAuth = () => {};
export const useDebounce = () => {};

// ✅ Functions - camelCase, verb prefix
export const getUserById = () => {};
export const createPost = () => {};
export const formatDate = () => {};

// ✅ Constants - UPPER_SNAKE_CASE
export const API_BASE_URL = '...';
export const MAX_RETRIES = 3;

// ✅ Variables - camelCase
const userName = 'John';
const isAuthenticated = true;

// ✅ Interfaces/Types - PascalCase
interface UserData {}
type ApiResponse<T> = {};

// ✅ Enums - PascalCase
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}
```

---

## State Management

### When to Use What?

| State Type            | Tool            | Example                        |
| --------------------- | --------------- | ------------------------------ |
| Server state          | TanStack Query  | API data, cached responses     |
| Global client state   | Zustand         | Auth, theme, language          |
| Local component state | useState        | Form inputs, toggles, local UI |
| Form state            | React Hook Form | Complex forms with validation  |

### Zustand Best Practices

```typescript
// ✅ Good - Typed, with selectors
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterStore>()(
  devtools(
    set => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
      decrement: () => set(state => ({ count: state.count - 1 })),
    }),
    { name: 'CounterStore' },
  ),
);

// Selectors
export const selectCount = (state: CounterStore) => state.count;
export const selectActions = (state: CounterStore) => ({
  increment: state.increment,
  decrement: state.decrement,
});

// Usage in component
const count = useCounterStore(selectCount); // Only re-renders when count changes
const { increment } = useCounterStore(selectActions);
```

### TanStack Query Best Practices

```typescript
// ✅ Good - Separate service and hook
// api/services.ts
export const userService = {
  getUser: (id: string) => api.get<User>(`/users/${id}`),
};

// api/queries.ts
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUser(id),
    staleTime: 5 * 60 * 1000,
  });
};

// Usage
const { data, isLoading, error } = useUser('123');
```

---

## API Integration

### Using the API Client

```typescript
import { api, buildQueryParams } from '@/core/api';

// GET request
const response = await api.get<User>('/users/123');
const user = response.body.data;

// POST request
const response = await api.post<User, CreateUserDto>('/users', {
  name: 'John',
  email: 'john@example.com',
});

// With query parameters
const params = buildQueryParams({ page: 1, pageSize: 10 });
const response = await api.get<User[]>(`/users?${params}`);
```

### Error Handling

```typescript
import { ApiClientError, ApiErrorType } from '@/core/api';

try {
  await api.post('/users', data);
} catch (error) {
  if (error instanceof ApiClientError) {
    if (error.is(ApiErrorType.VALIDATION_ERROR)) {
      // Handle validation errors
      console.log(error.details); // Field-level errors
    } else if (error.is(ApiErrorType.AUTHENTICATION_ERROR)) {
      // Redirect to login
      router.push('/login');
    } else {
      // Show generic error
      toast.error(error.getUserMessage());
    }
  }
}
```

---

## Component Patterns

### Container/Presentational Pattern

```typescript
// ✅ Presentational Component (UI only)
interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const UserList: FC<UserListProps> = ({ users, onDelete, isLoading }) => {
  if (isLoading) return <Spinner />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

// ✅ Container Component (logic)
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers();
  const deleteMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return <UserList users={users} onDelete={handleDelete} isLoading={isLoading} />;
};
```

### Compound Components

```typescript
// ✅ For complex, reusable components
const Card = ({ children }) => <div className="card">{children}</div>;
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

## Testing Guidelines

### Unit Tests

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

```typescript
// useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Still old value

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated'); // Now updated

    vi.useRealTimers();
  });
});
```

---

## Performance Best Practices

### 1. Memoization

```typescript
// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ Don't over-memoize
const simple = useMemo(() => count * 2, [count]); // Unnecessary
```

### 2. Code Splitting

```typescript
// ✅ Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<Spinner />}>
  <HeavyChart data={data} />
</Suspense>
```

### 3. Virtualization

```typescript
// ✅ For long lists, use virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

---

## Common Patterns

### Loading States

```typescript
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

return <DataDisplay data={data} />;
```

### Conditional Rendering

```typescript
// ✅ Early returns
if (!user) return null;
if (isLoading) return <Spinner />;

// ✅ Logical AND
{isAdmin && <AdminPanel />}

// ✅ Ternary for either/or
{isLoggedIn ? <Dashboard /> : <Login />}
```

### Event Handlers

```typescript
// ✅ Arrow functions for simple cases
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Separate function for complex logic
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // Complex logic...
};

<form onSubmit={handleSubmit}>...</form>
```

---

## Questions or Issues?

- Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review existing code for patterns
- Ask the team in Slack #frontend channel

Happy coding! 🚀
