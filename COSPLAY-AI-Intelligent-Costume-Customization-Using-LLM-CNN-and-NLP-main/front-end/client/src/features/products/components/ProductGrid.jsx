import ProductCard from './ProductCard';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'Pants', value: 'pants' },
  { label: 'Jackets', value: 'jackets' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Footwear', value: 'footwear' },
];

/**
 * Product grid with category filter tabs, search bar, and pagination.
 */
function ProductGrid({ products, pagination, isLoading, error, filters, onFilterChange, onPageChange }) {
  const selectedCategory = filters?.category || '';

  return (
    <div>
      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-2xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {/* Category Tabs */}
        <nav
          style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}
          aria-label="Product categories"
        >
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onFilterChange({ category: value })}
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500',
                paddingBottom: '4px',
                borderBottom: selectedCategory === value
                  ? '1px solid var(--color-primary)'
                  : '1px solid transparent',
                color: selectedCategory === value
                  ? 'var(--color-primary)'
                  : 'var(--text-muted)',
                transition: 'color var(--transition-fast), border-color var(--transition-fast)',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={filters?.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: 'var(--space-xl)',
            textAlign: 'center',
            color: 'var(--color-error)',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div
                style={{
                  aspectRatio: '3 / 4',
                  backgroundColor: 'var(--color-surface)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div style={{ height: '12px', width: '60%', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ height: '16px', width: '80%', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid" style={{ padding: '0 0 72px' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div
          style={{
            padding: 'var(--space-3xl)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 300, marginBottom: 'var(--space-sm)', color: 'var(--text-muted)' }}>
            No products found.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Try adjusting your filters or search term.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-3xl)',
          }}
        >
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            style={{
              padding: 'var(--space-xs) var(--space-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: pagination.page <= 1 ? 'var(--text-light)' : 'var(--text-main)',
              cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Prev
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            style={{
              padding: 'var(--space-xs) var(--space-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: pagination.page >= pagination.totalPages ? 'var(--text-light)' : 'var(--text-main)',
              cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
