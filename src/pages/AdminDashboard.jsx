import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      const res = await API.get('/polls');
      setPolls(res.data);
    } catch (err) {
      alert('Failed to fetch polls');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    try {
      await API.delete(`/polls/${id}`);
      alert('Poll deleted successfully');
      fetchPolls();
    } catch (err) {
      alert('Error deleting poll');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Do you want to close this poll early?')) return;
    try {
      await API.post(`/polls/close/${id}`);
      alert('Poll closed successfully');
      fetchPolls();
    } catch (err) {
      alert('Failed to close poll');
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛠️ Admin Dashboard</h2>
      <button onClick={() => navigate('/create-poll')} style={styles.createBtn}>
        ➕ Create New Poll
      </button>

      <div style={styles.pollList}>
        {polls.length === 0 ? (
          <p style={styles.empty}>No polls found.</p>
        ) : (
          polls.map((poll) => {
            const isExpired = new Date(poll.closingDate) < new Date() || poll.isClosed;

            return (
              <div key={poll._id} style={styles.pollCard}>
                <h3 style={styles.pollQuestion}>{poll.question}</h3>
                <p>Closes: {new Date(poll.closingDate).toLocaleString()}</p>

                {isExpired && (
                  <div style={styles.resultsBox}>
                    <strong>📊 Result:</strong>
                    {poll.options.map((opt) => (
                      <p key={opt} style={styles.result}>
                        {opt} - {poll.votes?.[opt] || 0} vote(s)
                      </p>
                    ))}
                  </div>
                )}

                <div style={styles.actions}>
                  {!poll.isClosed && new Date(poll.closingDate) > new Date() && (
                    <button
                      onClick={() => handleClose(poll._id)}
                      style={styles.closeBtn}
                    >
                      🚫 Close Poll Early
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(poll._id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete Poll
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    background: '#0d1117',
    minHeight: '100vh',
    color: '#f5f5f5',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px',
    color: '#58a6ff'
  },
  createBtn: {
    padding: '10px 20px',
    background: '#2ea043',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '30px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  pollList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  pollCard: {
    backgroundColor: '#161b22',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #30363d'
  },
  pollQuestion: {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#c9d1d9'
  },
  resultsBox: {
    marginTop: '10px',
    background: '#1f2937',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #374151'
  },
  result: {
    fontSize: '14px',
    marginLeft: '10px',
    color: '#d1d5db'
  },
  actions: {
    marginTop: '14px',
    display: 'flex',
    gap: '12px'
  },
  deleteBtn: {
    backgroundColor: '#da3633',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  closeBtn: {
    backgroundColor: '#ffb300',
    color: '#000',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: '16px'
  }
};

export default AdminDashboard;
