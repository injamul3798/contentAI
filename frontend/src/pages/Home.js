import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function Home() {
  const { user, authTokens } = useContext(AuthContext);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const isAdmin = user?.role === 'admin';
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/contents/')
      .then((res) => setContents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const analyzeContent = async (id, text) => {
    if (!authTokens || !user) return;
    
    setIsAnalyzing(true);
    setModalOpen(true);
    setAnalysis(null);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/analyze-content/',
        { content_id: id, text },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setAnalysis(res.data);
    } catch {
      setAnalysis({ error: 'Failed to analyze content. Please try again.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setAnalysis(null);
  };

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      axios
        .delete(`http://127.0.0.1:8000/contents/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          }
        })
        .then(() => {
          setContents(contents.filter((c) => c.id !== id));
        })
        .catch(() => {
          alert('Failed to delete content');
        });
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: 'center', fontSize: 18, color: '#4f46e5' }}>
        Loading content...
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '30px auto',
        padding: 20,
        fontFamily: "'Inter', sans-serif",
        color: '#e0e7ff',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: 32,
          marginBottom: 30,
          color: '#a5b4fc',
        }}
      >
        Explore Curated Content
      </h2>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: 12,
            padding: 24,
            maxWidth: 600,
            width: '90%',
          },
          overlay: {
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 1000,
          },
        }}
      >
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: '#f43f5e',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 style={{ color: '#a5b4fc', marginBottom: 20 }}>AI Analysis Results</h3>

        {isAnalyzing ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div
              style={{
                border: '4px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTop: '4px solid #60a5fa',
                width: 40,
                height: 40,
                margin: '0 auto',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ marginTop: 10 }}>Analyzing content...</p>
          </div>
        ) : analysis ? (
          analysis.error ? (
            <p style={{ color: '#f43f5e' }}>{analysis.error}</p>
          ) : (
            <>
              <section style={{ marginBottom: 20 }}>
                <h4 style={{ color: '#a5b4fc', marginBottom: 8 }}>Summary</h4>
                <p
                  style={{
                    background: '#0f172a',
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  {analysis.summary || 'No summary available'}
                </p>
              </section>

              <section style={{ marginBottom: 20 }}>
                <h4 style={{ color: '#a5b4fc', marginBottom: 8 }}>Sentiment</h4>
                <p
                  style={{
                    background: '#0f172a',
                    padding: 12,
                    borderRadius: 8,
                    color:
                      analysis.sentiment === 'positive'
                        ? '#4ade80'
                        : analysis.sentiment === 'negative'
                        ? '#f43f5e'
                        : '#60a5fa',
                  }}
                >
                  {analysis.sentiment || 'Neutral'}
                </p>
              </section>

              <section>
                <h4 style={{ color: '#a5b4fc', marginBottom: 8 }}>Key Topics</h4>
                <div
                  style={{
                    background: '#0f172a',
                    padding: 12,
                    borderRadius: 8,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {analysis.topics && analysis.topics.length > 0 ? (
                    analysis.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#334155',
                          padding: '4px 8px',
                          borderRadius: 20,
                          fontSize: 14,
                        }}
                      >
                        {topic}
                      </span>
                    ))
                  ) : (
                    <p>No topics identified</p>
                  )}
                </div>
              </section>
            </>
          )
        ) : null}
      </Modal>

      {contents.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 18, color: '#cbd5e1' }}>
          No content available.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'center',
          }}
        >
          {contents.map((item) => (
            <article
              key={item.id}
              style={{
                width: 260,
                borderRadius: 14,
                padding: 16,
                background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                boxShadow: '0 8px 20px rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h4 style={{ fontSize: 18, color: '#c7d2fe', marginBottom: 10 }}>
                {item.title}
              </h4>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 10,
                    marginBottom: 12,
                  }}
                />
              )}

              <p style={{ fontSize: 14, color: '#e2e8f0' }}>
                {expandedCards[item.id] ? item.body : `${item.body.slice(0, 80)}${item.body.length > 80 ? '...' : ''}`}
              </p>

              {item.body.length > 80 && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'transparent',
                    border: 'none',
                    color: '#818cf8',
                    fontSize: 12,
                    marginTop: 4,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {expandedCards[item.id] ? 'Show less' : 'Read more'}
                </button>
              )}

              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
                <strong>Category:</strong> {item.category}
              </p>

              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                <strong>Author:</strong> {item.owner?.username || 'Unknown'}
              </p>

              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                {(user?.is_admin || authTokens) && (
                  <button
                    onClick={() => analyzeContent(item.id, item.body)}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      background: '#8b5cf6',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.background = '#7c3aed')}
                    onMouseLeave={(e) => (e.target.style.background = '#8b5cf6')}
                  >
                    Analyze with AI
                  </button>
                )}

               {user && (user.id === item.owner?.id || isAdmin) && (
                  <>
                    <Link
                      to={`/content/edit/${item.id}`}
                      style={{
                        fontSize: 13,
                        color: '#60a5fa',
                        textDecoration: 'none',
                        fontWeight: 600,
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 8px',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = '#93c5fd')}
                      onMouseLeave={(e) => (e.target.style.color = '#60a5fa')}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        fontSize: 13,
                        background: '#f43f5e',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.25s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#dc2626')}
                      onMouseLeave={(e) => (e.target.style.background = '#f43f5e')}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CSS keyframes for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}