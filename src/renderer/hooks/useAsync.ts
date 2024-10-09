// src/renderer/hooks/useAsync.ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const run = useCallback((promise: Promise<T>) => {
    setState({ status: 'pending', data: null, error: null });
    promise
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => setState({ status: 'error', data: null, error }));
  }, []);

  return { ...state, run };
}

export default useAsync;
