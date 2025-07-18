import React, { Suspense, lazy, useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import { useDispatch } from "react-redux";
import { setToken, setAvailableScreens } from "./store/authSlice";

const RemoteTicketsApp = lazy(() => import("tickets/SupportTicketsApp"));

export default function App() {
  const dispatch = useDispatch();
  const [localToken, setLocalToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screens, setScreens] = useState([]);

  const handleLogin = async (userData) => {
    if (!userData || !userData.token) {
      console.error("Invalid login response", userData);
      return;
    }

    const token = userData.token || localToken;
    setLocalToken(token);
    dispatch(setToken(token));

    try {
      const response = await fetch("http://localhost:8000/me/screens", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      dispatch(setAvailableScreens(data.availableScreens || []));

      if (response.ok) {
        setScreens(data.availableScreens || []);
        setIsLoggedIn(true);
      } else {
        console.error("Error fetching screens:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to fetch screens:", error);
    }
  };

  return (
    <div style={styles.appContainer}>
      {!isLoggedIn ? (
        <div style={styles.loginContainer}>
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <Suspense
          fallback={
            <div style={styles.loadingOverlay}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading Tickets App...</p>
            </div>
          }
        >
          <div style={styles.appLayout}>
            <div style={styles.sidebar}>
              <Sidebar screens={screens} />
            </div>
            <div style={styles.content}>
              <RemoteTicketsApp />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    fontFamily: "'Segoe UI', sans-serif",
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
  },
  appLayout: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: '24px 0',
    borderRight: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    overflowY: 'auto',
    padding: '24px',
    color: '#ffffff',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    zIndex: 2000,
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #333',
    borderTop: '5px solid #ff4d4d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#ff4d4d',
    fontWeight: '500',
  },
};

// Inject keyf
