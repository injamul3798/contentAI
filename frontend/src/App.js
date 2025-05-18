import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContentCreate from './pages/ContentCreate';
import ContentEdit from './pages/ContentEdit';
import Profile from './pages/Profile';
import axios from 'axios';

export const AuthContext = React.createContext();

function App() {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  const setTokens = (data) => {
    localStorage.setItem('authTokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const setUserInfo = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
    setAuthTokens(null);
    setUser(null);
  };

  // Set default axios header if token exists
  useEffect(() => {
    if(authTokens) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authTokens.access;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, user, setUser: setUserInfo, logoutUser }}>
      <Router>
        <Navbar />
        <div className="app-container" style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!authTokens ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!authTokens ? <Register /> : <Navigate to="/" />} />
              <Route path="/content/create" element={authTokens ? <ContentCreate /> : <Navigate to="/login" />} />
              <Route path="/content/edit/:id" element={authTokens ? <ContentEdit /> : <Navigate to="/login" />} />
              <Route path="/profile" element={authTokens ? <Profile /> : <Navigate to="/login" />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
