import React from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../store/authSlice';

const Sidebar = ({ screens }) => {
  const dispatch = useDispatch();

  const handleNavigation = (path, e) => {
    e.preventDefault();
    dispatch(setPage(path));
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.header}>Navigation</h2>
      <ul style={styles.list}>
        {screens.map((screen) => (
          <li key={screen.path} style={styles.listItem}>
            <button
              style={styles.link}
              onClick={(e) => handleNavigation(screen.id, e)}
            >
              {screen.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2c2c2c',
    padding: '20px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#fff',
    textAlign: 'center',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flex: 1,
  },
  listItem: {
    marginBottom: '16px',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#ddd',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '10px 15px',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.2s, color 0.2s',
  },
  linkHover: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
  },
};

export default Sidebar;

