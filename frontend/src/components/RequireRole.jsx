import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RequireRole = ({ role: requiredRole, children }) => {
  const { user, role, loading, profile } = useAuth();

  // Debug logging
  console.log('RequireRole Debug:', {
    user: user?.email,
    role,
    requiredRole,
    profile,
    loading
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    console.log(`Role mismatch: required=${requiredRole}, actual=${role}`);
    return <Navigate to="/" replace />;
  }

  console.log('Access granted!');
  return children;
};

export default RequireRole;
