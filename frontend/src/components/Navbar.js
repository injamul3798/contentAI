import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{
      padding: '12px 30px',
      background: 'linear-gradient(90deg, #1a2238 0%, #2e3a63 100%)', // deep navy blue gradient
      color: '#e0e7ff', // light lavender text
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: '0 4px 12px rgba(46,58,99,0.6)', // soft blue shadow
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div>
        <Link
          to="/"
          style={{
            color: '#a3bffa', // pastel blue
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '28px',
            letterSpacing: '2px',
            userSelect: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={e => e.target.style.color = '#c7d2fe'} // lighter pastel on hover
          onMouseLeave={e => e.target.style.color = '#a3bffa'}
        >
          Content Curation
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                marginRight: '25px',
                color: '#cbd5e1', // soft light blue-gray
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                padding: '6px 14px',
                borderRadius: '6px',
                transition: 'background-color 0.25s, color 0.25s',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#4f46e5';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#cbd5e1';
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                color: '#6366f1', // moderate violet blue
                fontWeight: '600',
                fontSize: '16px',
                padding: '6px 16px',
                borderRadius: '6px',
                border: '2px solid #6366f1',
                textDecoration: 'none',
                transition: 'background-color 0.25s, color 0.25s',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#6366f1';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6366f1';
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span style={{
              marginRight: '25px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#dbeafe', // soft sky blue text
              userSelect: 'none',
            }}>
              Welcome, <span style={{ color: '#a78bfa' /* soft violet */ }}>{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                backgroundColor: '#f87171', // light red (soft)
                border: 'none',
                color: '#fff',
                padding: '8px 18px',
                fontSize: '16px',
                borderRadius: '8px',
                fontWeight: '700',
                boxShadow: '0 2px 6px rgba(248,113,113,0.5)',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#ef4444'; // stronger red on hover
                e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.7)';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = '#f87171';
                e.target.style.boxShadow = '0 2px 6px rgba(248,113,113,0.5)';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
