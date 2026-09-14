import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const { slug, name, price, compareAtPrice, images, category, isNew } = product;

  const hasSale = compareAtPrice && compareAtPrice > price;
  const imageSrc = images?.[0] || 'https://images.unsplash.com/photo-1602293589930-45821b19d8ce?q=80&w=900&auto=format&fit=crop';

  return (
    <Link to={`/products/${slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-img">
          {(isNew || hasSale) && (
            <span className="card-tag">
              {hasSale ? 'Sale' : 'New'}
            </span>
          )}
          <img
            src={imageSrc}
            alt={name}
            style={{
              transform: isHovered ? 'scale(1.045)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
          />
        </div>
        <div className="card-name">{name}</div>
        <div className="card-meta">
          <span>{category?.name || 'Denim'}</span>
          <span>${typeof price === 'number' ? price.toFixed(2) : price}</span>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
