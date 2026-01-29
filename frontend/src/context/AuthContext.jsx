import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('aiva_token');
    if (token) {
      setUser({ 
        name: 'Alex Morgan', 
        email: 'alex.morgan@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
      }); 
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    localStorage.setItem('aiva_token', 'mock_token_123');
    setUser({ 
        name: 'Alex Morgan', 
        email: email || 'alex.morgan@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
    });
    return true;
  };

  const signup = (name, email, password) => {
    // Mock signup logic
    localStorage.setItem('aiva_token', 'mock_token_123');
    setUser({ 
        name: name || 'Alex Morgan', 
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('aiva_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
