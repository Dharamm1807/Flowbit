import React, { useEffect, useState } from 'react';

const TicketList = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tickets", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tickets");

      setTickets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchTickets();
    const intervalId = setInterval(fetchTickets, 10000);
    return () => clearInterval(intervalId);
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
        return { ...base, backgroundColor: '#555', color: '#fff' }; // Default gray
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Tickets</h2>

      {loading && <p style={styles.message}>Loading tickets...</p>}
      {error && <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>}
      {!loading && !error && tickets.length === 0 && (
        <p style={styles.message}>No tickets found.</p>
      )}

      <div style={styles.ticketList}>
        {tickets.map((ticket) => (
          <div key={ticket._id} style={styles.ticketCard}>
            <div style={styles.ticketHeader}>
              <h3 style={styles.ticketTitle}>{ticket.title}</h3>
              <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
            </div>
            <p style={styles.description}>{ticket.description}</p>
            <p style={styles.meta}>Priority: <strong>{ticket.priority}</strong></p>
            {ticket.assignedTo && (
              <p style={styles.meta}>
                Assigned to: <strong>{ticket.assignedTo?.name || ticket.assignedTo}</strong>
              </p>
            )}
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
    marginBottom: '12px',
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
    marginBottom: '8px',
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

export default TicketList;
