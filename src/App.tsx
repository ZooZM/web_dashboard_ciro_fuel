import { Providers } from '@/app/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Providers />
    </ErrorBoundary>
  );
}

export default App;
