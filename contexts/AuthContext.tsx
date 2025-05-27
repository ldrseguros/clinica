import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { loginUserApi, registerUserApi, fetchUserProfileApi } from '../services/api'; // Ensured relative path

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to check initial auth status

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Optionally: Verify token with backend and fetch user profile
          // For now, if token exists, we assume it's valid for demo purposes
          // In a real app, you'd call an endpoint like /api/auth/me
          // const userData = await fetchUserProfileApi(storedToken); 
          // setUser(userData);
          // setIsAuthenticated(true);
          // For demo, we'll decode a dummy user from token or set a mock one
          // This part needs to be replaced with actual token validation and user fetching
          // Simulating fetching user based on token, e.g. if token belongs to admin
          let dummyUser: User;
          if (storedToken.includes('admin-user-id')) { // A simple check for demo
             dummyUser = { id: 'admin-user-id', email: 'admin@clinicadpvoce.com.br', name: 'Administrador', role: 'ADMIN' };
          } else if (storedToken.includes('user-id-123')) {
             dummyUser = { id: 'user-id-123', email: 'user@example.com', name: 'Usuário Comum', role: 'USER' };
          }
          else { // Fallback or default user if token is generic
             dummyUser = { id: 'user-fallback', email: 'user@example.com', name: 'Usuário Demo', role: 'USER' };
          }
          setUser(dummyUser);
          setIsAuthenticated(true);

        } catch (error) {
          // console.error("Failed to initialize auth from token", error); // Also removing this for cleaner console during init
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await loginUserApi(email, password); // This will be a real API call
      localStorage.setItem('authToken', response.token);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Removed console.error("Login failed:", error);
      throw error; // Re-throw to be caught by the LoginPage
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await registerUserApi(name, email, password); // This will be a real API call
      // Typically, after registration, the user might need to log in or be logged in automatically
    } catch (error) {
      // console.error("Registration failed:", error); // Optionally remove this too if desired
      throw error; // Re-throw to be caught by the RegisterPage
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    // Optionally, call a backend logout endpoint
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};