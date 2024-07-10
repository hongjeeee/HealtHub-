// src/components/Sidebar.jsx
import React, {useContext} from 'react';
import { FaTachometerAlt, FaUserFriends, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { setIsLoggedIn, setUserName } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8081/healthhub/logout', { withCredentials: true });
      console.log("로그아웃");
      setIsLoggedIn(false);
      setUserName('');
      navigate('/first'); 
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <aside className={`sidebar ${isDarkMode ? 'dark' : ''}`}>
      <nav>
        <ul>
          <li className="active">
            <FaTachometerAlt className="icon" />
            Dashboard
          </li>
          <li>
            <FaUserFriends className="icon" />
            Leaderboard
          </li>
          <li>
            <FaEnvelope className="icon" />
            Messages
          </li>
          <li>
            <FaCog className="icon" />
            Settings
          </li>
          <li>
            <FaSignOutAlt className="icon" />
            <a onClick={handleLogout}>Sign Out</a> 
          </li>
        </ul>
      </nav>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {isDarkMode ? '라이트 모드' : '다크 모드'}
      </button>
    </aside>
  );
};

export default Sidebar;
