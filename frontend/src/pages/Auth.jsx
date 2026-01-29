import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      signup(formData.name, formData.email, formData.password);
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex text-text-900 bg-background-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        
        {/* Decorative Blob */}
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-primary-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-accent-200/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="w-full max-w-md z-10 bg-background-50/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex justify-center mb-8">
            <span className="text-3xl font-bold tracking-tighter text-primary-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-500" />
              AIVA
            </span>
          </div>

          <div className="flex bg-secondary-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${isLogin ? 'bg-background-50 shadow-sm text-primary-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${!isLogin ? 'bg-background-50 shadow-sm text-primary-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary-600 font-medium hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-primary-950 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-[20s]" />
        
        {/* Floating gradient blobs */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 text-center text-white px-12">
          <h1 className="text-5xl font-bold mb-6 font-serif tracking-wide leading-tight">
            Redefine Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">
              Style Journey
            </span>
          </h1>
          <p className="text-xl text-white/80 font-light max-w-lg mx-auto">
            Experience AI-driven fashion recommendations tailored exclusively for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
