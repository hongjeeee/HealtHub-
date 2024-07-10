import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // useLocation 추가
import AuthContext from './contexts/AuthContext';

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  // 로그인되어 있으면 요청된 페이지로 이동, 아니면 /first 페이지로 이동
  return isLoggedIn ? <Outlet /> : <Navigate to="/first" state={{ from: location }} replace />; 
};

export default PrivateRoute;
