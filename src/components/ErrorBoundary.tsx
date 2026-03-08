import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-design-cream dark:bg-[#0a0a0a] text-design-black dark:text-white p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-design-black dark:bg-white text-white dark:text-design-black rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
