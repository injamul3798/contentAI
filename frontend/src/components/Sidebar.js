import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  const linkStyle = {
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '15px',
    padding: '10px 14px',
    borderRadius: '8px',
    transition: 'background 0.3s, color 0.3s',
  };

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#f8f9fa',
      padding: '20px 15px',
      height: '100vh',
      boxSizing: 'border-box',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '10px',
      }}>
        Dashboard
      </h3>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={e => {
            e.target.style.background = '#dfe6e9';
            e.target.style.color = '#000';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#2c3e50';
          }}
        >
          📄 All Content
        </Link>

        {user && (
          <>
            <Link
              to="/content/create"
              style={linkStyle}
              onMouseEnter={e => {
                e.target.style.background = '#dfe6e9';
                e.target.style.color = '#000';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#2c3e50';
              }}
            >
              ➕ Create Content
            </Link>

            <Link
              to="/profile"
              style={linkStyle}
              onMouseEnter={e => {
                e.target.style.background = '#dfe6e9';
                e.target.style.color = '#000';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#2c3e50';
              }}
            >
              👤 My Profile
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
