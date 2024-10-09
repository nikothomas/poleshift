// src/renderer/routes/AppRoutes.tsx

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // No need to import HashRouter here
import Loading from '../components/Loading';
import Login from '../components/PreAuth/Login';
import SignUp from '../components/PreAuth/SignUp';
import SubscriptionPlans from '../components/PreAuth/SubscriptionPlans';
import MainApp from '../components/MainApp';
import ResetPassword from '../components/PreAuth/ResetPassword';
import useAuth from '../hooks/useAuth';

const AppRoutes: React.FC = () => {
  const { user, loading, handleLogin, handleSignUp } =
    useAuth();

  // Show loading spinner while authentication and subscription status are being determined
  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Routes accessible to unauthenticated users
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Routes accessible to authenticated users, regardless of subscription
  return (
    <Routes>
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/*" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
