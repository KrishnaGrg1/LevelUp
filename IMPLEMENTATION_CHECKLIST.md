# 📋 Implementation Checklist

## Immediate Actions (Start Using Now)

### ✅ Phase 1: Adopt New Infrastructure (Week 1)

- [ ] **Update package.json scripts**

  ```json
  {
    "scripts": {
      "lint:fix": "eslint . --fix",
      "type-check": "tsc --noEmit"
    }
  }
  ```

- [ ] **Run linter to see current issues**

  ```bash
  pnpm lint
  ```

- [ ] **Fix auto-fixable issues**

  ```bash
  pnpm lint --fix
  ```

- [ ] **Update existing API calls to use new client**
  - Replace `import axiosInstance from '@/lib/fetch'`
  - With `import { api } from '@/core/api'`

  Example:

  ```typescript
  // Before
  const response = await axiosInstance.get('/users');
  const users = response.data;

  // After
  const response = await api.get<User[]>('/users');
  const users = response.body.data;
  ```

- [ ] **Update Zustand store imports**

  ```typescript
  // Before
  import authStore from '@/stores/useAuth';

  // After
  import { useAuthStore, selectUser } from '@/features/auth';
  ```

- [ ] **Use optimized selectors**

  ```typescript
  // Before
  const { user } = useAuthStore();

  // After
  const user = useAuthStore(selectUser);
  ```

---

### ✅ Phase 2: Migrate Components (Week 2-3)

- [ ] **Create feature directories**

  ```bash
  mkdir -p src/features/user/components
  mkdir -p src/features/community/components
  mkdir -p src/features/quest/components
  ```

- [ ] **Move auth components**
  - [ ] Move `src/components/auth/*` → `src/features/auth/components/`
  - [ ] Update imports in pages
  - [ ] Test auth flow still works

- [ ] **Move user management components**
  - [ ] Move `src/components/users/*` → `src/features/user/components/`
  - [ ] Create user API services
  - [ ] Create user query hooks
  - [ ] Update admin pages

- [ ] **Move landing components**
  - [ ] Move `src/components/landing/*` → `src/shared/components/landing/`
  - [ ] Update landing pages

- [ ] **Move shared UI components**
  - [ ] `src/components/ui/*` → `src/shared/components/ui/` (already good)
  - [ ] `src/components/Navbar.tsx` → `src/shared/components/layout/Navbar.tsx`
  - [ ] `src/components/Footer.tsx` → `src/shared/components/layout/Footer.tsx`

---

### ✅ Phase 3: API Layer Refactoring (Week 3-4)

- [ ] **Create user feature API**

  ```
  src/features/user/api/
  ├── services.ts      # Raw API calls
  ├── queries.ts       # useUsers(), useUser(id)
  ├── mutations.ts     # useCreateUser(), useUpdateUser(), useDeleteUser()
  ├── types.ts         # User API types
  └── index.ts
  ```

- [ ] **Migrate auth API calls**
  - [ ] Update `src/lib/services/auth.ts` to use new API client
  - [ ] Or move to `src/features/auth/api/services.ts`
  - [ ] Update all auth mutation hooks

- [ ] **Migrate user API calls**
  - [ ] Update `src/lib/services/user.ts`
  - [ ] Create React Query hooks for user operations
  - [ ] Update components to use new hooks

- [ ] **Update query keys**

  ```typescript
  // Use centralized query keys
  import { queryKeys } from '@/core/config/query-client';

  useQuery({
    queryKey: queryKeys.users.list({ page, pageSize }),
    queryFn: () => userService.getUsers({ page, pageSize }),
  });
  ```

---

### ✅ Phase 4: Testing Setup (Week 4-5)

- [ ] **Install testing dependencies**

  ```bash
  pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
  ```

- [ ] **Create test setup files**
  - [ ] Create `vitest.config.ts` (see TESTING_GUIDE.md)
  - [ ] Create `tests/setup.ts`
  - [ ] Add test scripts to package.json

- [ ] **Write first tests**
  - [ ] Test `Button` component
  - [ ] Test `useAuth` hook
  - [ ] Test `authStore`
  - [ ] Test utility functions

- [ ] **Set up CI pipeline**
  - [ ] Add GitHub Actions workflow
  - [ ] Run tests on PR
  - [ ] Check linting
  - [ ] Type checking

---

### ✅ Phase 5: Documentation & Polish (Week 5-6)

- [ ] **Add JSDoc comments**
  - [ ] Document all public functions
  - [ ] Add examples to complex utilities
  - [ ] Document component props

- [ ] **Create feature README files**

  ```
  src/features/auth/README.md
  src/features/user/README.md
  ```

- [ ] **Update main README.md**
  - [ ] Add architecture section
  - [ ] Link to new documentation
  - [ ] Update setup instructions

- [ ] **Add pre-commit hooks**

  ```bash
  pnpm add -D husky lint-staged
  npx husky-init
  ```

  `.husky/pre-commit`:

  ```bash
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  pnpm lint-staged
  ```

  `package.json`:

  ```json
  {
    "lint-staged": {
      "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
    }
  }
  ```

---

## Quick Wins (Do These First)

### 1. Fix Import Order

Run ESLint auto-fix to organize all imports:

```bash
pnpm lint --fix
```

### 2. Replace API Client in One File

Pick one file that uses `axiosInstance` and update it to use the new `api` client. Test it works.

### 3. Use New Auth Store

Update one component to use `useAuthStore` with selectors:

```typescript
// Before
const { user, isAuthenticated } = authStore();

// After
import { useAuthStore, selectUser, selectIsAuthenticated } from '@/features/auth';

const user = useAuthStore(selectUser);
const isAuthenticated = useAuthStore(selectIsAuthenticated);
```

### 4. Add Type to One API Call

```typescript
// Before
const response = await api.get('/users');

// After
import type { User } from '@/lib/generated';
const response = await api.get<User[]>('/users');
```

---

## Validation Checklist

After each phase, verify:

- [ ] ✅ App builds without errors: `pnpm build`
- [ ] ✅ No TypeScript errors: `pnpm type-check`
- [ ] ✅ No lint errors: `pnpm lint`
- [ ] ✅ All pages load correctly
- [ ] ✅ Authentication flow works
- [ ] ✅ API calls succeed
- [ ] ✅ No console errors in browser

---

## Files to Update First

### High Priority

1. `src/components/auth/Login.tsx` - Update to use new hooks
2. `src/components/auth/Register.tsx` - Update to use new hooks
3. `src/components/users/UserManagement.tsx` - Update API calls
4. `src/hooks/use-auth.ts` - Migrate to feature module
5. `src/lib/services/auth.ts` - Use new API client

### Medium Priority

6. `src/components/ProfileDropdown.tsx` - Use logout hook
7. `src/components/DeleteModal.tsx` - Use delete mutation
8. All files importing from `@/stores/` - Update imports
9. All files using `axiosInstance` - Switch to new client

### Low Priority (Can Wait)

10. Landing page components
11. Static pages
12. Utility functions (if working fine)

---

## Common Pitfalls to Avoid

### ❌ Don't Do This

```typescript
// Importing entire store (causes re-renders)
const state = useAuthStore();

// Using 'any' type
const data: any = await api.get('/users');

// Ignoring ESLint errors
// eslint-disable-line

// Not handling errors
const data = await api.get('/users'); // No try-catch
```

### ✅ Do This Instead

```typescript
// Use selectors
const user = useAuthStore(selectUser);

// Use proper types
const data = await api.get<User[]>('/users');

// Fix ESLint issues or add explanation
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response is dynamic

// Handle errors properly
try {
  const data = await api.get<User[]>('/users');
} catch (error) {
  if (error instanceof ApiClientError) {
    // Handle error
  }
}
```

---

## Measuring Success

### Code Quality Metrics

- [ ] TypeScript strict mode with no `any` (or minimal)
- [ ] Zero ESLint errors
- [ ] 80%+ code coverage (after testing setup)
- [ ] All imports follow ordering rules

### Performance Metrics

- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB (analyze with `next build`)
- [ ] No unnecessary re-renders (use React DevTools Profiler)

### Developer Experience

- [ ] New developers can understand codebase
- [ ] Clear where to add new features
- [ ] Easy to find existing code
- [ ] Good IntelliSense support

---

## Need Help?

1. **Check Documentation**
   - `ARCHITECTURE.md` - System design
   - `DEVELOPER_GUIDE.md` - Coding patterns
   - `TESTING_GUIDE.md` - Testing setup

2. **Look at Examples**
   - `src/features/auth/` - Complete feature module
   - `src/shared/stores/` - Zustand patterns
   - `src/core/api/` - API client usage

3. **Common Issues**
   - Import errors: Check `tsconfig.json` paths
   - Type errors: Ensure proper type imports
   - Build errors: Run `pnpm type-check`

---

**Remember:** This is a gradual migration. You don't need to do everything at once. Start small, test often, and iterate! 🚀
