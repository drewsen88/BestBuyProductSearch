/**
 * useProductSearch hook
 * Handles product search with debouncing and state management
 */

import {useState, useEffect, useCallback, useRef} from 'react';
import {apiClient, ApiError} from '../data/api';
import {Product} from '../domain/models';
import {Config} from '../config';
import {useDebounce} from './useDebounce';

interface UseProductSearchResult {
  query: string;
  setQuery: (query: string) => void;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refresh: () => void;
}

export function useProductSearch(): UseProductSearchResult {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, Config.search.debounceMs);

  const searchProducts = useCallback(async (searchQuery: string) => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (searchQuery.length < Config.search.minQueryLength) {
      setProducts([]);
      setTotal(0);
      setError(null);
      return;
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.searchProducts(searchQuery, signal);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      // Ignore abort errors - component is unmounting or new search started
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setError(message);
      setProducts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchProducts(debouncedQuery);

    // Cleanup: abort fetch on unmount or when query changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, searchProducts]);

  const refresh = useCallback(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  return {
    query,
    setQuery,
    products,
    isLoading,
    error,
    total,
    refresh,
  };
}
