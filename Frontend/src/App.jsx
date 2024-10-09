import React, { useState } from 'react';
import {Route, Routes, BrowserRouter as Router, Outlet} from 'react-router-dom'
import Header from './components/Header.jsx';

function App() {
  const [showUserTable, setShowUserTable] = useState(false);  // Add state to control UserTable visibility

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
