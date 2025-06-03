import { useState, useCallback, useRef, useEffect } from 'react';
import { handleApiError } from '@/Utils/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  retry: () => void;
}

export const useApi = <T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const {
    immediate = false,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const lastArgsRef = useRef<unknown[]>([]);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      if (!mountedRef.current) return null;

      lastArgsRef.current = args;
      retryCountRef.current = 0;

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isSuccess: false,
      }));

      try {
        const result = await apiFunction(...args);
        
        if (!mountedRef.current) return null;

        setState({
          data: result,
          isLoading: false,
          error: null,
          isSuccess: true,
        });

        onSuccess?.(result);
        return result;
      } catch (error) {
        if (!mountedRef.current) return null;

        const errorMessage = handleApiError(error);
        
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
        });

        onError?.(errorMessage);
        return null;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const retry = useCallback(async () => {
    if (retryCountRef.current < retryCount) {
      retryCountRef.current += 1;      
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      return execute(...lastArgsRef.current);
    }
    return null;
  }, [execute, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
};

export const useFetch = <T = unknown>(
  apiFunction: () => Promise<T>,
  dependencies: unknown[] = []
) => {
  const api = useApi(apiFunction, { immediate: true });

  useEffect(() => {
    if (dependencies.length > 0) {
      api.execute();
    }
  }, dependencies);

  return api;
};

export const useMutation = <T = unknown, P = unknown>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) => {
  return useApi<T>(apiFunction as (...args: unknown[]) => Promise<T>, {
    ...options,
    immediate: false,
  });
};

export const useInfiniteQuery = <T = unknown>(
  apiFunction: (page: number, ...args: unknown[]) => Promise<{ data: T[]; hasMore: boolean }>,
  options: UseApiOptions = {}
) => {
  const [allData, setAllData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const api = useApi(apiFunction, {
    ...options,
    onSuccess: (result: unknown) => {
      const typedResult = result as { data: T[]; hasMore: boolean };
      setAllData(prev => page === 1 ? typedResult.data : [...prev, ...typedResult.data]);
      setHasMore(typedResult.hasMore);
      options.onSuccess?.(result);
    },
  });

  const loadMore = useCallback(() => {
    if (!api.isLoading && hasMore) {
      setPage(prev => prev + 1);
      api.execute(page + 1);
    }
  }, [api, hasMore, page]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    api.execute(1);
  }, [api]);

  useEffect(() => {
    if (options.immediate !== false) {
      api.execute(1);
    }
  }, []);

  return {
    data: allData,
    isLoading: api.isLoading,
    error: api.error,
    isSuccess: api.isSuccess,
    hasMore,
    loadMore,
    refresh,
    reset: () => {
      setPage(1);
      setAllData([]);
      setHasMore(true);
      api.reset();
    },
  };
};

export const usePolling = <T = unknown>(
  apiFunction: () => Promise<T>,
  interval: number = 5000,
  options: UseApiOptions = {}
) => {
  const api = useApi(apiFunction, options);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      api.execute();
    }, interval);
  }, [api, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (options.immediate !== false) {
      api.execute();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, []);

  return {
    ...api,
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current,
  };
};
