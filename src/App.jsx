import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PatientDashboard from '@/pages/PatientDashboard';
import DoctorDashboard from '@/pages/DoctorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import PatientProfile from '@/pages/PatientProfile';
import QRScanner from '@/pages/QRScanner';
import Landing from '@/pages/Landing';
import Footer from '@/components/Footer';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user, userRole } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${userRole}-dashboard`} replace /> : <Landing />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${userRole}-dashboard`} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${userRole}-dashboard`} replace />} />
      
      <Route 
        path="/patient-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/doctor-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patient/:id" 
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <PatientProfile />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/qr-scanner" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <QRScanner />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Unauthorized Access</h1></div>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>MediPulse - Digital Healthcare Platform</title>
          <meta name="description" content="Comprehensive digital healthcare platform for patients, doctors, and medical administrators" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;