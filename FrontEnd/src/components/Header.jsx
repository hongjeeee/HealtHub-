import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import LoginModal from './LoginModal';
import './style/Header.css';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';

const Header = () => {
  const { isLoggedIn, userName, setIsLoggedIn, setUserName } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:8081/healthhub/checkSession', { withCredentials: true });
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(response.data.mb_name);
        } else {
          setIsLoggedIn(false);
          setUserName('');
        }
      } catch (error) {
        console.error('세션 확인 에러:', error);
      }
    };

    checkSession();
  }, [setIsLoggedIn, setUserName]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8081/healthhub/logout', { withCredentials: true });
      setIsLoggedIn(false);
      setUserName('');
      closeLoginModal();
      navigate('/first');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <header className="header">
      <h1 className="logo">Health Hub</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              식사 기록
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
              캘린더
            </NavLink>
          </li>
          <li>
            <NavLink to="/account" className={({ isActive }) => (isActive ? 'active' : '')}>
              나의 계정
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="login">
        {isLoggedIn ? (
          <>
            <span>{userName}님 오늘도 건강한 하루되세요~</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : ''
        }
      </div>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
    </header>
  );
};

export default Header;
