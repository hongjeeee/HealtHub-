import React from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CalendarPage from './components/CalendarPage';
import AccountPage from './components/AccountPage';
import FirstPage from './components/FirstPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import AdminPage from './components/admin/AdminPage';
import AdminHeader from './components/admin/AdminHeader';
import { useLocation } from 'react-router-dom';

import { DarkModeProvider } from './components/admin/DarkModeContext';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (

   
    <AuthProvider>
      <DarkModeProvider>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <Routes>
        <Route path="/admin" element={<AdminPage></AdminPage>}/>
        <Route path="/first" element={<FirstPage />} />
        <Route element={<PrivateRoute />}> {/* PrivateRoute로 보호되는 라우트 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/first" replace />} />
      </Routes>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
