# Research & Decisions

## State Management
- **Decision**: Zustand
- **Rationale**: Minimal boilerplate, hook-based, highly performant. Avoids the overhead of Redux while providing better scalability than plain React Context for deeply nested components.
- **Alternatives considered**: Redux Toolkit (too heavy for current needs), React Context (prone to unnecessary re-renders).

## API & Data Fetching
- **Decision**: Axios + React Query
- **Rationale**: Axios provides powerful interceptors for JWT token injection and error handling. React Query provides caching, background synchronization, and native loading/error states without manual `useEffect` wiring.
- **Alternatives considered**: native `fetch` API (lacks interceptors), SWR (similar to React Query, but React Query has a slightly larger ecosystem and DevTools).

## Routing & Guards
- **Decision**: React Router v6 with Higher-Order Components (HOC)
- **Rationale**: Standard in the React ecosystem. HOCs allow wrapping existing routes without rewriting the entire route definition tree.
- **Alternatives considered**: Custom routing (unnecessary reinvention).
