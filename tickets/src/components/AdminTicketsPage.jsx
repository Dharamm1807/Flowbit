import React, { useState, useEffect } from 'react';

const AdminTicketsPage = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tickets/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const getStatusStyle = (status) => {
    const base = {
      padding: '4px 10px',
      borderRadius: '16px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
    };

    switch (status) {
      case 'open':
        return { ...base, backgroundColor: '#FFD700', color: '#000' }; // Yellow
      case 'in-progress':
        return { ...base, backgroundColor: '#1E90FF', color: '#fff' }; // Blue
      case 'closed':
        return { ...base, backgroundColor: '#32CD32', color: '#fff' }; // Green
      default:
        return { ...base, backgroundColor: '#555', color: '#fff' }; // Gray
    }
  };

  if (loading) return <div style={styles.message}>Loading tickets...</div>;
  if (error) return <div style={{ ...styles.message, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Tickets</h1>
      <div style={styles.ticketList}>
        {tickets.map(ticket => (
          <div key={ticket._id} style={styles.ticketCard}>
            <div style={styles.ticketHeader}>
              <h3 style={styles.ticketTitle}>{ticket.title}</h3>
              <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
            </div>
            <p style={styles.meta}>Created by: <strong>{ticket.createdBy?.email || 'Unknown'}</strong></p>
            <p style={styles.meta}>Priority: {ticket.priority}</p>
            <p style={styles.description}>{ticket.description}</p>
            <p style={styles.timestamp}>
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#f0f0f0',
    padding: '40px',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    fontWeight: 'bold',
  },
  message: {
    fontSize: '16px',
    margin: '20px',
    color: '#ccc',
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  ticketCard: {
    backgroundColor: '#1f1f1f',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  ticketTitle: {
    fontSize: '20px',
    fontWeight: '600',
  },
  description: {
    color: '#ccc',
    marginTop: '10px',
  },
  meta: {
    fontSize: '14px',
    color: '#aaa',
    marginBottom: '4px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
};

export default AdminTicketsPage;
