# 🔄 Migration Examples

This document shows **before/after examples** of how to update your existing code to use the new enterprise architecture.

---

## 1. API Client Usage

### ❌ Before (Old Way)

```typescript
// src/lib/services/auth.ts
import axiosInstance from '../fetch';

export const login = async (data: UserLoginInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(`/auth/login`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};
```

### ✅ After (New Way)

```typescript
// src/features/auth/api/services.ts
import { api } from '@/core/api';
import type { ApiResponse } from '@/core/api';
import type { Language } from '@/shared/stores';
import type { LoginCredentials, AuthResponse } from './types';

export const authService = {
  login: async (
    credentials: LoginCredentials,
    lang: Language,
  ): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse, LoginCredentials>('/auth/login', credentials, {
      headers: { 'X-Language': lang },
    });
    // Error handling is automatic via interceptors!
  },
};
```

**Benefits:**

- ✅ Shorter, cleaner code
- ✅ Automatic error transformation
- ✅ Type-safe request/response
- ✅ Consistent error structure

---

## 2. React Query Mutations

### ❌ Before (Component with Inline Logic)

```typescript
// src/components/auth/Login.tsx
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/services/auth';
import authStore from '@/stores/useAuth';
import { toast } from 'sonner';

export function LoginForm({ lang }: LoginFormProps) {
  const router = useRouter();
  const { setAuthenticated, setAdminStatus } = authStore();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginFormData) => login(data, lang),
    onSuccess: data => {
      setAuthenticated(true);
      const isAdmin = data?.body?.data?.isadmin || false;
      setAdminStatus(isAdmin);
      toast.success(data?.body.message);

      if (isAdmin) {
        router.push(`/${lang}/admin/dashboard`);
      } else {
        router.push(`/${lang}/user/dashboard`);
      }
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Login failed');
    },
  });

  // ... rest of component
}
```

### ✅ After (Using Custom Hook)

```typescript
// src/features/auth/api/mutations.ts
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const language = useLanguageStore((state) => state.language);
  const { setUser, setAdminStatus } = useAuthStore();

  return useMutation({
    mutationKey: mutationKeys.auth.login,
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials, language),

    onSuccess: (response) => {
      const user = response.body.data;
      const isAdmin = user?.isadmin || false;

      if (user) {
        setUser(user);
        setAdminStatus(isAdmin);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
      toastActions.success(response.body.message || 'Login successful!');

      const redirectPath = isAdmin ? `/${language}/admin/dashboard` : `/${language}/user/dashboard`;
      router.push(redirectPath);
    },

    onError: (error: Error) => {
      toastActions.error(error.message || 'Login failed');
    },
  });
};

// src/components/auth/Login.tsx (Component)
import { useLogin } from '@/features/auth/api/mutations';

export function LoginForm({ lang }: LoginFormProps) {
  const login = useLogin();

  const handleSubmit = async (data: LoginFormData) => {
    await login.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
      <Button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

**Benefits:**

- ✅ Reusable logic across components
- ✅ Centralized error handling
- ✅ Consistent cache management
- ✅ Easier to test
- ✅ Cleaner component code

---

## 3. Zustand Store Usage

### ❌ Before (Destructuring Everything)

```typescript
// Component.tsx
import authStore from '@/stores/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, setUser, logout } = authStore();

  // Component re-renders whenever ANY auth state changes!
  // Even if it only uses `user`

  return <div>{user?.name}</div>;
}
```

### ✅ After (Using Selectors)

```typescript
// Component.tsx
import { useAuthStore, selectUser } from '@/features/auth';

function MyComponent() {
  // Only re-renders when `user` changes
  const user = useAuthStore(selectUser);

  return <div>{user?.name}</div>;
}

// For actions only
function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  return <button onClick={logout}>Logout</button>;
}
```

**Benefits:**

- ✅ Prevents unnecessary re-renders
- ✅ Better performance
- ✅ More explicit dependencies
- ✅ Easier to track what triggers updates

---

## 4. Error Handling

### ❌ Before (Manual Error Parsing)

```typescript
try {
  await api.post('/users', data);
} catch (error: unknown) {
  const err = error as {
    response?: {
      data?: { body?: { message?: string; error?: string }; message?: string; error?: string };
    };
  };
  const errorMessage = err.response?.data?.body?.message || err.response?.data?.message || 'Failed';
  const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

  toast.error(errorMessage);
}
```

### ✅ After (Structured Error Handling)

```typescript
import { ApiClientError, ApiErrorType } from '@/core/api';
import { toastActions } from '@/shared/stores';

try {
  await api.post('/users', data);
} catch (error) {
  if (error instanceof ApiClientError) {
    // Type-safe error handling
    if (error.is(ApiErrorType.VALIDATION_ERROR)) {
      // Handle validation errors
      console.log(error.details); // Field-level errors
      toastActions.error('Please check your input');
    } else if (error.is(ApiErrorType.AUTHENTICATION_ERROR)) {
      // Redirect to login
      router.push('/login');
    } else {
      // Generic error with user-friendly message
      toastActions.error(error.getUserMessage());
    }
  }
}
```

**Benefits:**

- ✅ Type-safe error handling
- ✅ Consistent error structure
- ✅ User-friendly messages
- ✅ Easier to handle specific error types

---

## 5. Import Organization

### ❌ Before (Mixed Order)

```typescript
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import authStore from '@/stores/useAuth';
import type { User } from './types';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/services/auth';
```

### ✅ After (Organized with ESLint)

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External packages
import { useMutation } from '@tanstack/react-query';

// 3. Internal aliases (grouped by category)
import { useAuthStore } from '@/features/auth';
import { Button } from '@/ui/button';

// 4. Relative imports
import { authService } from './services';

// 5. Type imports (at the end)
import type { User } from './types';
```

Run `pnpm lint --fix` to auto-organize!

**Benefits:**

- ✅ Consistent across codebase
- ✅ Easier to scan imports
- ✅ Auto-fixed by ESLint
- ✅ Prevents duplicate imports

---

## 6. Component Structure

### ❌ Before (Mixed Responsibilities)

```typescript
export default function UserList() {
  const { language } = LanguageStore();
  const { page, pageSize, setPage, setPageSize } = usePaginationStore();

  // Data fetching in component
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users', language, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      return await getAllUsers(language, params);
    },
  });

  // Lots of logic here...

  return (
    <div>
      {/* Complex JSX */}
    </div>
  );
}
```

### ✅ After (Separated Concerns)

```typescript
// features/user/api/queries.ts
export const useUsers = () => {
  const language = useLanguageStore((state) => state.language);
  const { page, pageSize } = usePaginationStore();

  return useQuery({
    queryKey: queryKeys.users.list({ page, pageSize }),
    queryFn: () => userService.getUsers({ page, pageSize }, language),
    staleTime: 30000,
  });
};

// features/user/components/UserList.tsx (Presentational)
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
        <UserCard key={user.id} user={user} onDelete={onDelete} />
      ))}
    </ul>
  );
};

// features/user/components/UserListContainer.tsx (Container)
export const UserListContainer = () => {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteUser.mutate(id);
  };

  return <UserList users={users} onDelete={handleDelete} isLoading={isLoading} />;
};
```

**Benefits:**

- ✅ Reusable data hooks
- ✅ Testable components
- ✅ Clear separation of concerns
- ✅ Easier to maintain

---

## 7. Path Imports

### ❌ Before (Relative Paths)

```typescript
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../hooks/use-auth';
import authStore from '../../../stores/useAuth';
```

### ✅ After (Path Aliases)

```typescript
import { Button } from '@/ui/button';
import { useAuth } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth';
```

**Benefits:**

- ✅ Shorter imports
- ✅ No relative path confusion
- ✅ Easy to refactor
- ✅ Better IntelliSense

---

## 8. Type Definitions

### ❌ Before (Inline Types)

```typescript
const handleLogin = async (data: { email: string; password: string }) => {
  // ...
};

const response: {
  success: boolean;
  body: { data?: { id: string; email: string }; message?: string };
} = await login(data);
```

### ✅ After (Defined Types)

```typescript
// features/auth/api/types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Usage
const handleLogin = async (data: LoginCredentials) => {
  const response: ApiResponse<AuthResponse> = await authService.login(data);
};
```

**Benefits:**

- ✅ Reusable types
- ✅ Single source of truth
- ✅ Better IntelliSense
- ✅ Easier refactoring

---

## Migration Strategy

### For Each File:

1. **Update imports** - Use path aliases
2. **Update API calls** - Use new API client
3. **Update store usage** - Use selectors
4. **Update types** - Use shared types
5. **Update error handling** - Use ApiClientError
6. **Run linter** - `pnpm lint --fix`
7. **Test** - Verify functionality works

### Start With:

1. One small component
2. One API service file
3. One store file

Then expand to larger files once you're comfortable with the patterns!

---

## Quick Reference

| Old Pattern                               | New Pattern                        | Documentation      |
| ----------------------------------------- | ---------------------------------- | ------------------ |
| `import axiosInstance from '@/lib/fetch'` | `import { api } from '@/core/api'` | ARCHITECTURE.md    |
| `authStore()`                             | `useAuthStore(selectUser)`         | DEVELOPER_GUIDE.md |
| Mutation in component                     | Custom hook from feature           | DEVELOPER_GUIDE.md |
| Manual error parsing                      | `ApiClientError`                   | ARCHITECTURE.md    |
| Relative imports                          | Path aliases                       | tsconfig.json      |

---

**Remember:** You don't have to migrate everything at once. Start small, learn the patterns, then scale up! 🚀
