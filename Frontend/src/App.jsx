import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ColorSchemesExample from './Navbar/Navbar'; // Your Navbar component
import Login from './Login/Login'; // Import the login page

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: ""
  });

  const handleLogin = (username) => {
    setUser({
      isLoggedIn: true,
      name: username
    });
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      name: ""
    });
  };

  return (
    <div>
      {/* Show Navbar with user login/logout functionality */}
      <ColorSchemesExample user={user} onLogout={handleLogout} onLogin={handleLogin} />

      {/* Conditionally show login page or nothing when logged in */}
      {!user.isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        // Leaving this section empty when logged in
        <div className="home-content">
          {/* You can add any additional components for logged-in users here if needed */}
        </div>
      )}
    </div>
  );
}

export default App;
