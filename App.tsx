import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import ExamsPage from './pages/ExamsPage';
import FinancialsPage from './pages/FinancialsPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-clinic-background">
                <Sidebar />
                <main className="flex-1 p-6 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/:patientId" element={<PatientsPage />} />
                    <Route path="/exams" element={<ExamsPage />} />
                    <Route path="/financials" element={<FinancialsPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Catch-all for protected routes */}
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;