import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export default function ContentEdit() {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null); // New image file if selected
  const [existingImage, setExistingImage] = useState(''); // URL of current image
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch content details when component loads
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/contents/${id}/`, {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      },
    })
    .then(res => {
      setTitle(res.data.title);
      setBody(res.data.body);
      setCategory(res.data.category);
      setExistingImage(res.data.image);
    })
    .catch(() => {
      setError('Failed to load content');
    });
  }, [id, authTokens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('category', category);
    // Append new image only if user selected a new file to replace
    if (image) {
      formData.append('image', image);
    }

    axios.put(`http://127.0.0.1:8000/contents/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authTokens.access}`,
      },
    })
    .then(() => {
      alert('Content updated successfully');
      navigate('/'); // Redirect to home or content list after update
    })
    .catch(() => {
      setError('Error updating content');
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Content</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label>
          Existing Image:
          {existingImage ? (
            <img
              src={existingImage}
              alt="Current"
              style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }}
            />
          ) : (
            <p>No image available</p>
          )}
        </label>

        <label>
          New Image (Upload to replace):
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            style={{ marginTop: '4px' }}
          />
        </label>

        <label>
          Body:
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            rows={6}
            style={{ width: '100%', padding: '8px', marginTop: '4px', resize: 'vertical' }}
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={e => e.target.style.backgroundColor = '#007bff'}
        >
          Update Content
        </button>
      </form>
    </div>
  );
}
