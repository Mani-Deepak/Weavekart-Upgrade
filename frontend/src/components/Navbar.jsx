import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ShoppingBag, User, Heart, Sun, Moon, Sparkles, Search } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const Navbar = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Categories', path: '/categories' },
    { name: 'Trending', path: '/trending' },
    { name: 'Recommend', path: '/recommend' },
  ];

  if (!user && location.pathname === '/auth') return null;

  const showSidebarToggle = location.pathname !== '/home' && location.pathname !== '/auth';

  return (
    <nav className="bg-background-50/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50 h-16">
      <div className="container mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
           <div className="flex items-center gap-4">
              {showSidebarToggle && (
                <button 
                  onClick={toggleSidebar}
                  className="p-2 -ml-2 rounded-lg hover:bg-secondary-100 text-text-600 transition-colors hidden md:block"
                  aria-label="Toggle Sidebar"
                >
                  <Menu className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-90' : ''}`} />
                </button>
              )}
              
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-2 group flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-500 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl font-bold tracking-tighter text-text-900 font-serif">AIVA</span>
              </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="w-full px-4 py-2 pl-10 rounded-full bg-secondary-100 border-none focus:ring-2 focus:ring-primary-500 text-sm text-text-800 placeholder-text-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
             {/* Navigation Links */}
             <div className="flex items-center gap-6 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname === link.path ? 'text-primary-600' : 'text-text-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary-100 text-text-600 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/wishlist" className="p-2 rounded-full hover:bg-secondary-100 text-text-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            
            <Link to="/cart" className="p-2 rounded-full hover:bg-secondary-100 text-text-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </Link>

            <Link to="/profile" className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary-100 text-text-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-text-600">
               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-900">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background-50 border-b border-secondary-200 shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in">
             <div className="relative mb-2">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full px-4 py-2 pl-10 rounded-lg bg-secondary-100 border-none text-sm"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-text-700 hover:text-primary-600"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-secondary-200 my-2" />
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-700">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-700">
              <ShoppingBag className="w-5 h-5" /> Cart
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-700">
              <User className="w-5 h-5" /> Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
