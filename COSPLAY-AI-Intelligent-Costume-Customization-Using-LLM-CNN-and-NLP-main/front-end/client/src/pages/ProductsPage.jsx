import { useProducts } from '../features/products/hooks/useProducts';
import ProductGrid from '../features/products/components/ProductGrid';

function ProductsPage() {
  const { products, pagination, isLoading, error, filters, updateFilters, goToPage } =
    useProducts({ limit: 12 });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-xl)' }}>
      {/* Page Header */}
      <header style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--color-accent)',
            fontWeight: '600',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Cosplay
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '300',
            letterSpacing: '2px',
            marginBottom: 'var(--space-md)',
          }}
        >
          Collections
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: '1.7',
          }}
        >
          Timeless garments, thoughtfully crafted for modern living.
        </p>
      </header>

      {/* Grid with filters */}
      <ProductGrid
        products={products}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        filters={filters}
        onFilterChange={updateFilters}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default ProductsPage;
