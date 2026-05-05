import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RequireRole = ({ role: requiredRole, children }) => {
  const { user, role, loading } = useAuth();

  // Still initialising — wait for auth + profile to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role (admin always has access)
  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
