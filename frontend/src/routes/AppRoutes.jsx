import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import SharedLayout from '../components/SharedLayout';
import PlaceholderPage from '../components/PlaceholderPage';
import { ShoppingBag, Star, User, Heart, Tag } from 'lucide-react';

// Eager load critical pages
import Auth from '../pages/Auth';
import Home from '../pages/Home';

// Lazy load feature pages
const Recommend = lazy(() => import('../pages/Recommend'));
const Upload = lazy(() => import('../pages/Upload'));
const Describe = lazy(() => import('../pages/Describe'));
const VirtualTryOn = lazy(() => import('../pages/VirtualTryOn'));
const Profile = lazy(() => import('../pages/Profile'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));

// Placeholder components for now to prevent import errors if files don't exist yet
// We will create these shortly
const Products = lazy(() => import('../pages/Products'));
const Categories = () => <PlaceholderPage title="Categories" icon={Tag} />;
const Trending = () => <PlaceholderPage title="Trending" icon={Star} />;
const Wishlist = () => <PlaceholderPage title="Wishlist" icon={Heart} />;
const Cart = () => <PlaceholderPage title="Cart" icon={ShoppingBag} />;
// Profile placeholder removed
const About = () => <PlaceholderPage title="About Us" />;
const Contact = () => <PlaceholderPage title="Contact Us" />;

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<SharedLayout />}>
            <Route path="/home" element={<Home />} />
            
            {/* Recommendation Flow */}
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/describe" element={<Describe />} />
            <Route path="/virtual-try-on" element={<VirtualTryOn />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Main Pages */}
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
