# Quickstart Validation

## Prerequisites
- Node.js 18+
- Active internet connection for API requests (or mock server)

## Setup Commands
```bash
npm install zustand axios @tanstack/react-query react-hot-toast
```

## Test/Run Scenarios

1. **Auth Guard Validation**
   - Navigate to `/admin` while logged out.
   - **Expected Outcome**: Redirected to `/login` immediately.

2. **API Interceptor Validation**
   - Login to the application to receive a token.
   - Inspect the Network tab for any subsequent API request.
   - **Expected Outcome**: The `Authorization: Bearer <token>` header is present on outgoing requests.

3. **Global State Hydration**
   - Refresh the page while logged in.
   - **Expected Outcome**: The user remains logged in (Zustand `persist` middleware hydrates the state from LocalStorage).
