import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Order summary sticky panel displayed to the right of the cart items.
 * Shows subtotal breakdown, a coupon field (UI only for now), and checkout CTA.
 */
function CartSummary({ subtotal, itemCount }) {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponFocused, setCouponFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 12) : 0;
  const total = (subtotal + shipping).toFixed(2);

  return (
    <div
      style={{
        position: 'sticky',
        top: '100px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.15rem',
          fontWeight: '400',
          letterSpacing: '0.5px',
        }}
      >
        Order Summary
      </h2>

      {/* Coupon Input */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onFocus={() => setCouponFocused(true)}
          onBlur={() => setCouponFocused(false)}
          style={{
            flex: 1,
            padding: 'var(--space-xs) 0',
            border: 'none',
            borderBottom: couponFocused
              ? '1px solid var(--color-primary)'
              : '1px solid var(--color-border)',
            background: 'transparent',
            fontSize: '0.85rem',
            outline: 'none',
            letterSpacing: '1px',
            transition: 'border-color var(--transition-fast)',
          }}
        />
        <button
          onClick={() => {}}
          style={{
            padding: 'var(--space-xs) var(--space-sm)',
            border: '1px solid var(--color-border)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '500',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast), color var(--transition-fast)',
          }}
        >
          Apply
        </button>
      </div>

      {/* Price Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Shipping</span>
          <span>
            {subtotal === 0
              ? '—'
              : shipping === 0
              ? <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>Free</span>
              : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal > 0 && shipping > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
            Add ${(150 - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '500',
            fontSize: '1rem',
          }}
        >
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        disabled={itemCount === 0}
        onClick={() => navigate('/checkout')}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          backgroundColor: itemCount === 0
            ? 'var(--color-secondary)'
            : btnHovered
            ? 'var(--color-accent)'
            : 'var(--color-primary)',
          color: 'var(--text-inverse)',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: '500',
          cursor: itemCount === 0 ? 'not-allowed' : 'pointer',
          opacity: itemCount === 0 ? 0.6 : 1,
          transition: 'background-color var(--transition-fast)',
        }}
      >
        Proceed to Checkout
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>
        Secure checkout · Free returns within 30 days
      </p>
    </div>
  );
}

export default CartSummary;
