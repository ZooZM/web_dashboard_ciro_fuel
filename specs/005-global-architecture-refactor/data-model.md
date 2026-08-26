# Data Model

## AuthStore Entity
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'petrol_company' | 'transport_company';
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}
```

## AppStore Entity
```typescript
interface AppState {
  theme: 'light' | 'dark' | 'system';
  isRtl: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleRtl: () => void;
}
```
