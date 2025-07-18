import React, { useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: '40px 20px'
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333'
  },
  group: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  inputError: {
    borderColor: '#e74c3c'
  },
  errorMsg: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    marginTop: '4px'
  },
  successMsg: {
    marginTop: '15px',
    backgroundColor: '#e0f9e0',
    color: '#2d862d',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '500',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#4a90e2',
    color: 'white',
    fontSize: '1rem',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  },
  buttonHover: {
    backgroundColor: '#3b7bd5'
  },
  buttonDisabled: {
    backgroundColor: '#aac8ec',
    cursor: 'not-allowed'
  }
};

const NewTicketForm = ({token}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});

    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      assignedTo: form.assignedTo || null,
    };

    try {
      console.log("Submitting ticket with payload:", payload);
      console.log("Using token at form:", token);
      const res = await fetch("http://localhost:8000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          setErrors(data.details);
        } else {
          alert("Server error: " + (data.error || "Unknown error"));
        }
      } else {
        setSuccess(true);
        setForm({
          title: '',
          description: '',
          priority: 'medium',
          assignedTo: ''
        });
      }

    } catch (err) {
      alert("Failed to send request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Submit New Ticket</h2>

        <div style={styles.group}>
          <label style={styles.label}>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.title ? styles.inputError : {})
            }}
          />
          {errors.title && <div style={styles.errorMsg}>{errors.title}</div>}
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{
              ...styles.input,
              height: '80px',
              ...(errors.description ? styles.inputError : {})
            }}
          />
          {errors.description && (
            <div style={styles.errorMsg}>{errors.description}</div>
          )}
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Assign To (User ID)</label>
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Submitting...' : 'Create Ticket'}
        </button>

        {success && <div style={styles.successMsg}>Ticket created successfully!</div>}
      </form>
    </div>
  );
};

export default NewTicketForm;
