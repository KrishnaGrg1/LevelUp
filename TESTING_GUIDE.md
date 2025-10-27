# Testing Setup Guide

## Overview

This guide explains how to set up and use Vitest with React Testing Library for testing the LevelUp frontend application.

## Installation

```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/react-hooks jsdom
```

## Configuration

### 1. Create `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/lib/generated.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@/components': path.resolve(__dirname, './src/shared/components'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/types': path.resolve(__dirname, './src/shared/types'),
      '@/api': path.resolve(__dirname, './src/core/api'),
      '@/config': path.resolve(__dirname, './src/core/config'),
      '@/providers': path.resolve(__dirname, './src/core/providers'),
    },
  },
});
```

### 2. Create `tests/setup.ts`

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### 3. Update `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

## Test Examples

### Component Test

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Hook Test

```typescript
// useDebounce.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    // Update value
    rerender({ value: 'updated' });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Advance time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });
});
```

### API Hook Test with Mock

```typescript
// useLogin.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogin } from './mutations';
import { authService } from './services';

// Mock the auth service
vi.mock('./services', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useLogin', () => {
  it('calls authService.login with credentials', async () => {
    const mockResponse = {
      body: {
        data: { id: '1', email: 'test@test.com', isadmin: false },
        message: 'Login successful',
      },
    };

    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'test@test.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authService.login).toHaveBeenCalledWith(
      { email: 'test@test.com', password: 'password123' },
      'eng'
    );
  });
});
```

### Zustand Store Test

```typescript
// authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useAuthStore, resetAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('sets user and updates auth status', () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      UserName: 'testuser',
      isAdmin: true,
    };

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it('clears user on logout', () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Test what the user sees and interacts with
   - Don't test internal state unless necessary

2. **Use Testing Library Queries**
   - Prefer `getByRole` over `getByTestId`
   - Use semantic queries when possible

3. **Avoid Testing Third-Party Code**
   - Don't test Next.js, React, or library internals
   - Mock external dependencies

4. **Keep Tests Simple and Focused**
   - One assertion per test (when possible)
   - Clear test names that describe behavior

5. **Use Test Utilities**
   - Create helper functions for common setups
   - Reuse mock data across tests

## File Organization

```
tests/
├── setup.ts                 # Test setup
├── utils/                   # Test utilities
│   ├── renderWithProviders.tsx
│   └── mockData.ts
├── unit/                    # Unit tests
│   ├── components/
│   ├── hooks/
│   └── utils/
└── integration/             # Integration tests
    ├── features/
    └── flows/
```

## Useful Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
