import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthContextType } from '../../types';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext) as AuthContextType;
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner or a blank page while checking auth status
    return (
        <div className="flex items-center justify-center h-screen bg-clinic-background">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-clinic-primary"></div>
        </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;