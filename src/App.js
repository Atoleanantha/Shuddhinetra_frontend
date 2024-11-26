import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import DashboardLayoutBasic from './components/Dashboard';
import { postDataApi } from './services/apiService';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    // Keep token in sync with localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      if (!token) {
        console.error("No token found for logout");
        return;
      }

      const config = {
        headers: {
          Authorization: `Token ${token}`, // Ensure the token is passed correctly
        },
      };

      // Logout API call
      await postDataApi("/user-auth/logout/", {}, config);

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Update state
      setUser(null);
      setToken(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Router>
      <Routes>
        {/* If the user is authenticated, redirect them away from the login page */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Auth setUser={setUser} setToken={setToken} />
          }
        />
        {/* Protected dashboard routes */}
        <Route
          path="/*"
          element={
            token ? (
              <DashboardLayoutBasic user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
