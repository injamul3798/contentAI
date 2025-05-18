import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

function ContentDetail() {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/contents/${id}/`)
      .then(res => {
        setContent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch content:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Content not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{content.title}</h1>

      {content.image && (
        <img
          src={content.image}
          alt={content.title}
          className="w-full h-auto object-cover rounded-md mb-4"
        />
      )}

      <p className="text-sm text-gray-500 mb-2">
        <span className="font-semibold">By:</span> {content.owner.username}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-semibold">Category:</span> {content.category}
      </p>

      <div className="text-gray-700 mb-4 whitespace-pre-wrap">
        {content.body}
      </div>

      <div className="text-xs text-gray-400">
        <p>Created: {new Date(content.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(content.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ContentDetail;
