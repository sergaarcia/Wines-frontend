import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Simulando detección de la finalización de la sesión
    const checkSession = () => {
      const sessionExpired = false; // Cambia esta lógica para detectar sesiones caducadas
      if (sessionExpired) {
        logout();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
