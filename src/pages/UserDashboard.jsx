import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const UserDashboard = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  // Fetch only open polls (not closed + not expired)
const fetchPolls = async () => {
  try {
    const res = await API.get('/polls');
    console.log('✅ Raw API Response:', res.data);

    const now = new Date();

    res.data.forEach(poll => {
      console.log(
        `📌 Poll: ${poll.question} | Closes: ${poll.closingDate} | isClosed: ${poll.isClosed}`
      );
    });

    const openPolls = Array.isArray(res.data)
      ? res.data.filter(
          (poll) =>
            new Date(poll.closingDate) > now &&
            poll.isClosed === false
        )
      : [];

    console.log('✅ Open Polls:', openPolls);

    setPolls(openPolls);
  } catch (err) {
    console.error('❌ Fetch error:', err.response?.data || err.message);
    alert('Failed to fetch polls');
  }
};


  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗳️ Open Polls</h2>

      <div style={styles.pollList}>
        {polls.length === 0 ? (
          <p style={styles.noPolls}>No open polls available at the moment.</p>
        ) : (
          polls.map((poll) => (
            <div key={poll._id} style={styles.pollCard}>
              <h4 style={styles.question}>{poll.question}</h4>
              <p style={styles.closing}>Closes on: {new Date(poll.closingDate).toLocaleString()}</p>
              <button
                onClick={() => navigate(`/poll/${poll._id}`)}
                style={styles.voteBtn}
              >
                🗳 Vote Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#121212',
    color: '#f5f5f5',
    minHeight: '100vh'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#00bcd4',
    fontSize: '28px'
  },
  pollList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  pollCard: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    borderLeft: '5px solid #00bcd4'
  },
  question: {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#ffffff'
  },
  closing: {
    fontSize: '14px',
    color: '#aaaaaa'
  },
  voteBtn: {
    marginTop: '12px',
    padding: '10px 16px',
    backgroundColor: '#00bcd4',
    color: '#121212',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  noPolls: {
    color: '#888',
    textAlign: 'center',
    fontSize: '16px'
  }
};

export default UserDashboard;
