import React from "react";
import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminStore();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
