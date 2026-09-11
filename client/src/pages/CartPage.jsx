import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItemRow from '../features/cart/components/CartItemRow';
import CartSummary from '../features/cart/components/CartSummary';

function CartPage() {
  const { items, subtotal, itemCount, isLoading, error } = useCart();
  const { isAuthenticated } = useAuth();

  /* ─── Not Logged In ─── */
  if (!isAuthenticated) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-3xl) var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          style={{ margin: '0 auto var(--space-lg)' }}
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: '300',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Your Bag
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
          Sign in to view and manage your shopping bag.
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: 'var(--space-md) var(--space-2xl)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-inverse)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '500',
          }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  /* ─── Loading ─── */
  if (isLoading && items.length === 0) {
    return (
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'var(--space-3xl) var(--space-xl)',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 'var(--space-3xl)',
        }}
      >
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '88px 1fr auto',
                gap: 'var(--space-lg)',
                padding: 'var(--space-lg) 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ width: '88px', aspectRatio: '3/4', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', paddingTop: 'var(--space-xs)' }}>
                <div style={{ height: '16px', width: '70%', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: '320px', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>{error}</p>
        <Link to="/products" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--color-primary)', paddingBottom: '2px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ─── Empty Cart ─── */
  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-3xl) var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
          style={{ margin: '0 auto var(--space-lg)' }}
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: '300',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Your Bag is Empty
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', lineHeight: '1.7' }}>
          Explore our collections and add something you love.
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: 'var(--space-md) var(--space-2xl)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-inverse)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '500',
          }}
        >
          Shop Collections
        </Link>
      </div>
    );
  }

  /* ─── Full Cart ─── */
  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: 'var(--space-3xl) var(--space-xl)',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-2xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: '300',
            letterSpacing: '1px',
          }}
        >
          Your Bag
        </h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 'var(--space-3xl)',
          alignItems: 'start',
        }}
      >
        {/* ─── Cart Items List ─── */}
        <div>
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          {/* Continue Shopping */}
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ─── Order Summary Panel ─── */}
        <CartSummary subtotal={subtotal} itemCount={itemCount} />
      </div>
    </div>
  );
}

export default CartPage;
