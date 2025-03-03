import React, { useState } from 'react';
import {Route, Routes, BrowserRouter as Router, Outlet} from 'react-router-dom'
import Header from './components/Header.jsx';
import { ToastContainer } from 'react-toastify';

function App() {
  const [showUserTable, setShowUserTable] = useState(false);  // Add state to control UserTable visibility
  const [isLogin,setIsLogin] = useState(true);
   
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <Outlet context={[isLogin,setIsLogin]}/>
    </>
  );
}

export default App;
