import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import AIDesignPage from '../pages/AIDesignPage';

const router = createBrowserRouter([
  // ==========================================
  // NORMAL WEBSITE PAGES
  // ==========================================
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: 'login',
        element: <LoginPage />,
      },

      {
        path: 'register',
        element: <RegisterPage />,
      },

      {
        path: 'products',
        element: <ProductsPage />,
      },

      {
        path: 'products/:slug',
        element: <ProductDetailPage />,
      },

      {
        path: 'cart',
        element: <CartPage />,
      },
    ],
  },

  // ==========================================
  // COSPLAY DESIGN STUDIO
  // ==========================================
  {
    path: '/ai-design',
    element: <AIDesignPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;