import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// React only supports error boundaries as class components — no hooks-based equivalent
// exists, so this is the sole exception to the functional-components-only rule.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled dashboard error', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-svh items-center justify-center text-center">
          <p className="text-muted-foreground">Something went wrong. Please reload the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
