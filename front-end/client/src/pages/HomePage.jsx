import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';

const sampleProducts = [
  {
    id: 1,
    name: 'Astro Mid Blue Baggy',
    color: 'Washed Blue',
    price: '$128',
    isNew: true,
    image: '/images/products/astro_mid_blue_baggy.jpg',
    slug: 'Wide-leg-jean',
  },
  {
    id: 2,
    name: 'Astro Mid Black Baggy',
    color: 'Raw Black',
    price: '$186',
    isNew: false,
    image: '/images/products/astro_mid_rise_baggy.jpg',
    slug: 'Wide-leg-jean',
  },
  {
    id: 3,
    name: 'Cos Charcoal',
    color: 'Washed Black',
    price: '$134',
    isNew: true,
    image: '/images/products/washed_black_boxy.jpg',
    slug: 'Boxy T-shirt',
  },
  {
    id: 4,
    name: 'Cos Blue',
    color: 'Washed Blue',
    price: '$142',
    isNew: false,
    image: '/images/products/washed_blue_boxy.jpg',
    slug: 'Boxy T-shirt',
  },
  {
    id: 5,
    name: 'Cos Chocolate',
    color: 'Washed Brown',
    price: '$148',
    isNew: false,
    image: '/images/products/washed_brown_boxy.jpg',
    slug: 'Boxy T-shirt',
  },
  {
    id: 6,
    name: 'Cos Cyan',
    color: 'Washed Cyan',
    price: '$168',
    isNew: false,
    image: '/images/products/washed_cyan_boxy.png',
    slug: 'Boxy T-shirt',
  },
];

function HomePage() {
  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* AI Design Studio Promo */}
      <section className="ai-promo">
        <div className="ai-promo-text">
          <h2>The Creative Assistant You Deserve</h2>
          <p>From first prompt to finished garment, design your own fit — down to the last measurement.</p>
          <Link to="/ai-design" className="ai-promo-btn">
            Design
          </Link>
        </div>
      </section>

      {/* Section Head */}
      <div className="section-head">
        <h2>New arrivals</h2>
        <Link to="/products">View all</Link>
      </div>

      {/* Product Grid */}
      <div className="grid">
        {sampleProducts.map((product) => (
          <Link to={`/products/${product.slug}`} key={product.id} className="card">
            <div className="card-img">
              {product.isNew && <span className="card-tag">New</span>}
              <img src={product.image} alt={product.name} />
            </div>
            <div className="card-name">{product.name}</div>
            <div className="card-meta">
              <span>{product.color}</span>
              <span>{product.price}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial Split Section */}
      <div className="split">
        <div className="split-img">
          <img
            src="/images/products/astro_mid_rise_baggy.jpg"
            alt="Studio detail"
          />
        </div>
        <div className="split-text">
          <span>The Fabric</span>
          <h3>Every pair is cut from 14oz Japanese selvedge, woven on the same shuttle looms since 1962.</h3>
          <Link to="/products">Read about our mills</Link>
        </div>
      </div>
    </>
  );
}

export default HomePage;