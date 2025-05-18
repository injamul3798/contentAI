import React, { useContext } from 'react';
import { AuthContext } from '../App';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>👤</div>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>My Profile</h2>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          <strong>Username:</strong> {user.username}
        </p>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          <strong>Role:</strong> {user.is_admin ? 'Admin' : 'End-User'}
        </p>
      </div>
    </div>
  );
}
