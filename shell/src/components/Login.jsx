import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      console.log('Sending login request with:', { email, password });

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (response.ok) {
        onLogin(data);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2>Login</h2>
      <div style={styles.form}>
        <label>Email:</label>
        <input
          type="email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>Login</button>
      </div>
    </form>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    width: '90%',
    margin: '80px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#1a1a1a',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ff4d4d',
    fontSize: '16px',
    width: '80%', // smaller width to keep it centered
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};
