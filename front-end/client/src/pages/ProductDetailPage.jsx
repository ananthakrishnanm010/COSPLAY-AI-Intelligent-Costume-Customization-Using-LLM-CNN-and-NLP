import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../features/products/hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function ProductDetailPage() {
  const { slug } = useParams();
  const { product, isLoading, error } = useProduct(slug);
  const { addItem, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addStatus, setAddStatus] = useState(null); // 'success' | 'error' | null
  const [addBtnHovered, setAddBtnHovered] = useState(false);

  // Loading State
  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3xl)',
          }}
        >
          <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {[80, 50, 100, 40, 60].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? '32px' : '16px', width: `${w}%`, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-xl)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: 'var(--space-md)', color: 'var(--text-muted)' }}>
          Product Not Found
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 'var(--space-xl)' }}>
          {error || 'The product you are looking for does not exist.'}
        </p>
        <Link to="/products" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--color-primary)', paddingBottom: '2px' }}>
          Back to Collections
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    compareAtPrice,
    images,
    category,
    variants,
    reviews,
  } = product;

  const hasSale = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasSale ? Math.round((1 - price / compareAtPrice) * 100) : null;

  // Group variants by size
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = selectedVariant
    ? [...new Set(variants.filter((v) => v.size === selectedVariant.size).map((v) => v.color))]
    : [];

  const handleSizeSelect = (size) => {
    const firstVariantOfSize = variants.find((v) => v.size === size);
    setSelectedVariant(firstVariantOfSize || null);
  };

  const handleColorSelect = (color) => {
    const variant = variants.find(
      (v) => v.size === selectedVariant?.size && v.color === color
    );
    setSelectedVariant(variant || null);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      setAddStatus('error-variant');
      return;
    }

    const result = await addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
    });

    if (result.success) {
      setAddStatus('success');
      setTimeout(() => setAddStatus(null), 3000);
    } else {
      setAddStatus('error');
      setTimeout(() => setAddStatus(null), 3000);
    }
  };

  const avgRating =
    reviews?.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-xl)' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 'var(--space-xl)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
        <Link to="/" style={{ color: 'var(--text-light)' }}>Home</Link>
        <span style={{ margin: '0 var(--space-xs)' }}>/</span>
        <Link to="/products" style={{ color: 'var(--text-light)' }}>Collections</Link>
        <span style={{ margin: '0 var(--space-xs)' }}>/</span>
        <span style={{ color: 'var(--text-main)' }}>{name}</span>
      </nav>

      {/* Main Content — Two Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'var(--space-3xl)',
          marginBottom: 'var(--space-3xl)',
        }}
      >
        {/* ─── Left: Image Gallery ─── */}
        <div>
          {/* Primary Image */}
          <div
            style={{
              aspectRatio: '3/4',
              backgroundColor: 'var(--color-surface)',
              marginBottom: 'var(--space-sm)',
              overflow: 'hidden',
            }}
          >
            {images?.[selectedImageIndex] ? (
              <img
                src={images[selectedImageIndex]}
                alt={name}
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
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Row */}
          {images?.length > 1 && (
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  style={{
                    width: '64px',
                    aspectRatio: '1',
                    border: i === selectedImageIndex ? '2px solid var(--color-primary)' : '2px solid transparent',
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'border-color var(--transition-fast)',
                    cursor: 'pointer',
                    background: 'none',
                  }}
                >
                  <img src={src} alt={`${name} view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Right: Product Info ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Category */}
          {category && (
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', fontWeight: '600' }}>
              {category.name}
            </span>
          )}

          {/* Name */}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: '300', lineHeight: '1.2', letterSpacing: '0.5px' }}>
            {name}
          </h1>

          {/* Rating */}
          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                    fill={i < Math.round(Number(avgRating)) ? 'var(--color-accent)' : 'none'}
                    stroke="var(--color-accent)" strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '500', color: hasSale ? 'var(--color-accent)' : 'var(--text-main)' }}>
              ${price.toFixed(2)}
            </span>
            {hasSale && (
              <>
                <span style={{ fontSize: '1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ${compareAtPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', padding: '2px 8px', fontWeight: '600', letterSpacing: '1px' }}>
                  -{discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div style={{ width: '48px', height: '1px', backgroundColor: 'var(--color-border)' }} />

          {/* Description */}
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.75' }}>
            {description}
          </p>

          <div style={{ width: '48px', height: '1px', backgroundColor: 'var(--color-border)' }} />

          {/* Size Selector */}
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', color: 'var(--text-light)', marginBottom: 'var(--space-sm)' }}>
              Size
              {selectedVariant && (
                <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-main)', textTransform: 'none', letterSpacing: 0 }}>
                  — {selectedVariant.size}
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
              {sizes.map((size) => {
                const isSelected = selectedVariant?.size === size;
                const sizeVariants = variants.filter((v) => v.size === size);
                const sizeInStock = sizeVariants.some((v) => v.inventory > 0);
                return (
                  <button
                    key={size}
                    onClick={() => sizeInStock && handleSizeSelect(size)}
                    disabled={!sizeInStock}
                    style={{
                      minWidth: '44px',
                      padding: 'var(--space-xs) var(--space-sm)',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                      color: isSelected ? 'var(--text-inverse)' : sizeInStock ? 'var(--text-main)' : 'var(--text-light)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.5px',
                      cursor: sizeInStock ? 'pointer' : 'not-allowed',
                      opacity: sizeInStock ? 1 : 0.4,
                      transition: 'all var(--transition-fast)',
                      textDecoration: sizeInStock ? 'none' : 'line-through',
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector — shown after size picked */}
          {selectedVariant && colors.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', color: 'var(--text-light)', marginBottom: 'var(--space-sm)' }}>
                Color — <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-main)' }}>{selectedVariant.color}</span>
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {colors.map((color) => {
                  const isSelected = selectedVariant?.color === color;
                  const colorVariant = variants.find((v) => v.size === selectedVariant.size && v.color === color);
                  const colorInStock = colorVariant?.inventory > 0;
                  return (
                    <button
                      key={color}
                      onClick={() => colorInStock && handleColorSelect(color)}
                      disabled={!colorInStock}
                      style={{
                        padding: 'var(--space-xs) var(--space-md)',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
                        color: isSelected ? 'var(--text-main)' : colorInStock ? 'var(--text-muted)' : 'var(--text-light)',
                        fontSize: '0.8rem',
                        cursor: colorInStock ? 'pointer' : 'not-allowed',
                        opacity: colorInStock ? 1 : 0.4,
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inventory Badge */}
          {selectedVariant && (
            <p style={{ fontSize: '0.8rem', color: selectedVariant.inventory > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {selectedVariant.inventory > 0
                ? selectedVariant.inventory <= 5
                  ? `Only ${selectedVariant.inventory} left in stock`
                  : 'In Stock'
                : 'Out of Stock'}
            </p>
          )}

          {/* Status Messages */}
          {addStatus === 'success' && (
            <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(75, 107, 85, 0.1)', borderLeft: '2px solid var(--color-success)', color: 'var(--color-success)', fontSize: '0.85rem' }}>
              Added to your bag successfully.
            </div>
          )}
          {addStatus === 'error' && (
            <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(168, 76, 76, 0.08)', borderLeft: '2px solid var(--color-error)', color: 'var(--color-error)', fontSize: '0.85rem' }}>
              Failed to add to bag. Please try again.
            </div>
          )}
          {addStatus === 'error-variant' && (
            <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(168, 76, 76, 0.08)', borderLeft: '2px solid var(--color-error)', color: 'var(--color-error)', fontSize: '0.85rem' }}>
              Please select a size before adding to bag.
            </div>
          )}

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || (selectedVariant && selectedVariant.inventory === 0)}
            className="btn-outline"
            style={{
              width: '100%',
              padding: '14px 28px',
              fontSize: '13px',
              letterSpacing: '0.5px',
            }}
          >
            {cartLoading
              ? 'Adding...'
              : !isAuthenticated
              ? 'Sign In to Add to Bag'
              : 'Add to Bag'}
          </button>

          {/* Back Link */}
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
            Back to Collections
          </Link>
        </div>
      </div>

      {/* ─── Reviews Section ─── */}
      {reviews && reviews.length > 0 && (
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '300', marginBottom: 'var(--space-xl)' }}>
            Customer Reviews
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: 'var(--space-lg)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)' }}>
                    {review.user?.name || 'Anonymous'}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                        fill={i < review.rating ? 'var(--color-accent)' : 'none'}
                        stroke="var(--color-accent)" strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {review.comment}
                  </p>
                )}
                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
