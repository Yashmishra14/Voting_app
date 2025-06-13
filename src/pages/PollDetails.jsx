import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const PollDetails = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data.poll);
      setHasVoted(res.data.hasVoted);

      // Decode role from JWT token
      const token = localStorage.getItem('token');
      if (token) {
        const base64 = token.split('.')[1];
        const payload = JSON.parse(atob(base64));
        setUserRole(payload.role); // "Admin" or "User"
      }
    } catch (err) {
      console.error('❌ Poll fetch error:', err);
      setMessage('Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async () => {
    if (!selectedOption) return alert('Please select an option');

    try {
      const res = await API.post(`/polls/vote/${id}`, { selectedOption });
      setMessage(res.data.message);
      setHasVoted(true);
      fetchPoll(); // Refresh results
    } catch (err) {
      console.error('❌ Vote error:', err);
      alert(err.response?.data?.message || 'Failed to vote');
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!poll) return <div style={styles.error}>Poll not found</div>;

  const isPollClosed = new Date(poll.closingDate) < new Date();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{poll.question}</h2>
      <p style={styles.subtext}>Closes on: {new Date(poll.closingDate).toLocaleString()}</p>

      {message && <p style={styles.message}>{message}</p>}

      {/* Show results only if Admin */}
      {userRole === 'Admin' ? (
        <>
          <h4 style={styles.resultsHeading}>📊 Poll Results:</h4>
          {poll.options.map((opt) => (
            <p key={opt} style={styles.resultOption}>
              <strong>{opt}</strong>: {poll.votes?.[opt] || 0} vote(s)
            </p>
          ))}
        </>
      ) : (
        <>
          {!hasVoted && !isPollClosed ? (
            <>
              <div style={styles.options}>
                {poll.options.map((opt) => (
                  <label key={opt} style={styles.option}>
                    <input
                      type="radio"
                      name="vote"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <button onClick={submitVote} style={styles.voteBtn}>
                🗳️ Submit Vote
              </button>
            </>
          ) : (
            <p style={styles.info}>You have already voted. Thank you!</p>
          )}
        </>
      )}
    </div>
  );
};

// 🎨 Unique Dark Theme Styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    background: '#121212',
    color: '#e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px'
  },
  subtext: {
    fontSize: '14px',
    color: '#aaaaaa'
  },
  message: {
    color: '#4caf50',
    marginTop: '10px'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#ffffff'
  },
  error: {
    padding: '20px',
    color: 'red',
    textAlign: 'center'
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px'
  },
  option: {
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  voteBtn: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#2196f3',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  resultsHeading: {
    marginTop: '20px',
    fontSize: '18px'
  },
  resultOption: {
    backgroundColor: '#1a1a1a',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '8px',
    border: '1px solid #333'
  },
  info: {
    marginTop: '20px',
    color: '#999'
  }
};

export default PollDetails;
