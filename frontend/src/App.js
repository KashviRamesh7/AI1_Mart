import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import PortalChooser from './pages/PortalChooser';
import UserAuth from './pages/UserAuth';
import StaffAuth from './pages/StaffAuth';
import UserStore from './pages/UserStore';
import AdminShell from './pages/AdminShell';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner"/><p>Loading AI1Mart...</p></div>;
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PortalChooser />} />
            <Route path="/login" element={<UserAuth />} />
            <Route path="/staff-login" element={<StaffAuth />} />
            <Route path="/store/*" element={
              <PrivateRoute allowedRoles={['customer']}>
                <UserStore />
              </PrivateRoute>
            }/>
            <Route path="/admin/*" element={
              <PrivateRoute allowedRoles={['admin','superadmin','manager','staff']}>
                <AdminShell />
              </PrivateRoute>
            }/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
