import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import EligibilityPage from './pages/EligibilityPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';

// Protected Citizen Pages
import UserDashboard from './pages/UserDashboard';
import SavedSchemesPage from './pages/SavedSchemesPage';
import UserProfilePage from './pages/UserProfilePage';

// Protected Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSchemesPage from './pages/AdminSchemesPage';

// 404
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/user/schemes" element={<SchemesPage />} />
          <Route path="/user/schemes/:id" element={<SchemeDetailsPage />} />
          <Route path="/user/eligibility" element={<EligibilityPage />} />
          <Route path="/user/voice-assistant" element={<VoiceAssistantPage />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/saved-schemes"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <SavedSchemesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Administrator Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schemes"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminSchemesPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
