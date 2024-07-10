import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  userName: '',
  setIsLoggedIn: () => {},
  setUserName: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, setIsLoggedIn, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
