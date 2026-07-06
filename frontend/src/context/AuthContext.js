import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { socket } from '../utils/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ai1mart_token');
    if (token) {
      API.get('/auth/me')
        .then(r => { setUser(r.data); socket.connect(); })
        .catch(() => localStorage.removeItem('ai1mart_token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('ai1mart_token', data.token);
    setUser(data);
    socket.connect();
    return data;
  };

  const register = async (form) => {
    const { data } = await API.post('/auth/register', form);
    localStorage.setItem('ai1mart_token', data.token);
    setUser(data);
    socket.connect();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ai1mart_token');
    setUser(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
