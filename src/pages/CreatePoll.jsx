import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [closingDate, setClosingDate] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    } else {
      alert('You can add a maximum of 6 options');
    }
  };

  const removeOption = (index) => {
    if (options.length <= 2) return alert('At least 2 options are required');
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return alert('Question is required');
    if (options.some(opt => !opt.trim())) return alert('Options cannot be empty');
    if (!closingDate) return alert('Closing date is required');

    try {
      const res = await API.post('/polls/create', {
        question,
        options,
        closingDate
      });

      alert(res.data.message);
      navigate('/admin');
    } catch (err) {
      console.error('Poll creation error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Poll creation failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗳️ Create a New Poll</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Poll Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
          placeholder="Enter your poll question"
          required
        />

        <label style={styles.label}>Poll Options:</label>
        {options.map((option, index) => (
          <div key={index} style={styles.optionRow}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              style={styles.optionInput}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                style={styles.removeBtn}
                title="Remove"
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption} style={styles.addBtn}>
          ➕ Add Option
        </button>

        <label style={styles.label}>Closing Date & Time:</label>
        <input
          type="datetime-local"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.submitBtn}>✅ Create Poll</button>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={styles.backBtn}
        >
          ⬅ Back to Dashboard
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '650px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    background: '#1e1e2f',
    color: '#f1f1f1',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
  },
  heading: {
    textAlign: 'center',
    fontSize: '26px',
    marginBottom: '30px',
    color: '#00ffff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '-10px',
    color: '#ccc'
  },
  input: {
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2b2b3d',
    color: '#f0f0f0',
    outlineColor: '#00bfff'
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  optionInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2b2b3d',
    color: '#fff'
  },
  removeBtn: {
    backgroundColor: '#ff4d4f',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer'
  },
  addBtn: {
    padding: '10px 14px',
    background: '#00bcd4',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: 'fit-content'
  },
  submitBtn: {
    padding: '14px',
    background: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  backBtn: {
    marginTop: '15px',
    background: 'transparent',
    border: 'none',
    color: '#00bfff',
    cursor: 'pointer',
    fontSize: '15px',
    textDecoration: 'underline'
  }
};

export default CreatePoll;
