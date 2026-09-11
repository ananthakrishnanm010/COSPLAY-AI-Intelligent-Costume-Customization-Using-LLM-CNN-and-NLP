import { Link } from 'react-router-dom';

function Footer() {
  return (
    <>
      <footer className="main-footer">
        <div>
          <h4>Cosplay.</h4>
          <p>Creativity Perfectly Crafted.</p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Shop</div>
          <Link to="/products">New Arrivals</Link>
          <Link to="/products">Denim</Link>
          <Link to="/products">Basics</Link>
          <Link to="/products">Archive Sale</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Help</div>
          <div>Sizing Guide</div>
          <div>Shipping</div>
          <div>Returns</div>
          <div>Contact</div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Studio</div>
          <div>About</div>
          <div>Our Mills</div>
          <div>Journal</div>
          <div>Stockists</div>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Cosplay Studio</span>
        <span>Shipping worldwide</span>
      </div>
    </>
  );
}

export default Footer;
