import React from 'react';
import './AdminHeader.css';
import { useDarkMode } from './DarkModeContext';

const AdminHeader = () => {
  
  const { isDarkMode } = useDarkMode();

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="logo">Health Hub</h1>
      <span>관리자님 오늘도 건강한 하루되세요~</span>
    </header>
  );
};

export default AdminHeader;