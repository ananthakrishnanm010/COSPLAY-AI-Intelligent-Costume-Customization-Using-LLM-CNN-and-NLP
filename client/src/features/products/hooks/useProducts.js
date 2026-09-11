import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/**
 * Hook to fetch a paginated, filterable list of products.
 * @param {object} initialFilters - Initial filter values (category, search, etc.)
 */
export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(params);
      setProducts(response.data ?? []);
      setPagination(response.pagination ?? null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { products, pagination, isLoading, error, filters, updateFilters, goToPage };
}

/**
 * Hook to fetch a single product by its slug.
 * @param {string} slug
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProductBySlug(slug);
        if (!cancelled) setProduct(response.data?.product ?? null);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Product not found.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, isLoading, error };
}
