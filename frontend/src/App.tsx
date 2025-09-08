import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

import { AppRoutes } from './routes';
import { Button } from './components/ui/button';

// Cria uma única instância do QueryClient para toda a aplicação.
const queryClient = new QueryClient();

function App() {
  return (
    // ErrorBoundary: um "colete salva-vidas" para a sua aplicação.
    // Se algum componente filho quebrar durante a renderização, esta UI de fallback será mostrada.
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div 
          className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center"
          role="alert"
        >
          <h1 className="text-2xl font-bold text-destructive">Algo correu muito mal...</h1>
          <pre className="mt-2 w-full max-w-lg whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
            {error.message}
          </pre>
          <Button onClick={resetErrorBoundary}>
            Tentar novamente
          </Button>
        </div>
      )}
    >
      {/* Provedor do TanStack Query: habilita o cache de dados da API em toda a aplicação. */}
      <QueryClientProvider client={queryClient}>
        {/* Provedor do React Router: habilita a navegação baseada em URL. */}
        <BrowserRouter>
          {/* O componente que renderiza a página correta com base no URL atual. */}
          <AppRoutes />
          
          {/* Componente para mostrar as notificações (toasts) no canto do ecrã. */}
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

