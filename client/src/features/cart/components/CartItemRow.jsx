import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

/**
 * A single row in the cart — shows product image, name, variant,
 * a quantity stepper, line total, and a remove button.
 */
function CartItemRow({ item }) {
  const { updateItem, removeItem, isLoading } = useCart();
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { id, product, variant, quantity } = item;
  const lineTotal = (product.price * quantity).toFixed(2);
  const imageSrc = product.images?.[0] || null;

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1 || updating) return;
    setUpdating(true);
    await updateItem(id, newQty);
    setUpdating(false);
  };

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    await removeItem(id);
    // No need to setRemoving(false) — the item unmounts on removal
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr auto',
        gap: 'var(--space-lg)',
        padding: 'var(--space-lg) 0',
        borderBottom: '1px solid var(--color-border)',
        opacity: removing ? 0.4 : 1,
        transition: 'opacity var(--transition-fast)',
      }}
    >
      {/* Product Image */}
      <Link to={`/products/${product.slug}`} style={{ flexShrink: 0 }}>
        <div
          style={{
            width: '88px',
            aspectRatio: '3/4',
            backgroundColor: 'var(--color-surface)',
            overflow: 'hidden',
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          <Link
            to={`/products/${product.slug}`}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem',
              fontWeight: '400',
              color: 'var(--text-main)',
              display: 'block',
              marginBottom: 'var(--space-2xs)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </Link>
          {variant && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              {variant.size}{variant.color ? ` / ${variant.color}` : ''}
            </p>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            ${product.price.toFixed(2)} each
          </p>
        </div>

        {/* Quantity Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 'var(--space-sm)' }}>
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isLoading || updating}
            aria-label="Decrease quantity"
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: quantity <= 1 ? 'var(--text-light)' : 'var(--text-main)',
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            −
          </button>
          <span
            style={{
              width: '40px',
              height: '32px',
              border: '1px solid var(--color-border)',
              borderLeft: 'none',
              borderRight: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: 'var(--text-main)',
            }}
          >
            {updating ? '…' : quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isLoading || updating}
            aria-label="Increase quantity"
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Line Total + Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-md)', flexShrink: 0 }}>
        <span style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-main)' }}>
          ${lineTotal}
        </span>
        <button
          onClick={handleRemove}
          disabled={removing}
          aria-label={`Remove ${product.name} from cart`}
          style={{
            color: 'var(--text-light)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: removing ? 'not-allowed' : 'pointer',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItemRow;
