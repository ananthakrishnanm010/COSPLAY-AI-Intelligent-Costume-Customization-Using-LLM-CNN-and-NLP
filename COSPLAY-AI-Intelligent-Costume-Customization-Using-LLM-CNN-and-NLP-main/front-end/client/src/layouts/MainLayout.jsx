import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
      }}
    >
      <Navbar />
      <main style={{ flex: '1 0 auto' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
