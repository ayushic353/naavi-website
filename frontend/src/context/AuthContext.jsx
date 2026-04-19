import React, { createContext, useContext, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('naaviUser')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('naaviToken', data.token);
      localStorage.setItem('naaviUser', JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('naaviToken', data.token);
      localStorage.setItem('naaviUser', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Account created!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('naaviToken');
    localStorage.removeItem('naaviUser');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
