import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth.store';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuthStore();

  // 유저가 없으면 로그인 페이지로 리다이렉션
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
