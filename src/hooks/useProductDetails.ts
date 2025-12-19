/**
 * useProductDetails hook
 * Fetches and manages product details state
 */

import {useState, useEffect, useCallback, useRef} from 'react';
import {apiClient, ApiError} from '../data/api';
import {ProductDetails} from '../domain/models';

interface UseProductDetailsResult {
  product: ProductDetails | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProductDetails(sku: string): UseProductDetailsResult {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProductDetails = useCallback(async () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getProductDetails(sku, signal);
      setProduct(result);
    } catch (err) {
      // Ignore abort errors - component is unmounting or new request started
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load product details. Please try again.';
      setError(message);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [sku]);

  useEffect(() => {
    fetchProductDetails();

    // Cleanup: abort fetch on unmount or when sku changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProductDetails]);

  return {
    product,
    isLoading,
    error,
    refresh: fetchProductDetails,
  };
}
