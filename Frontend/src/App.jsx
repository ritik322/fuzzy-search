import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ColorSchemesExample from "./Navbar/Navbar";
import FilterComponent from "./Filters/Filter";
import SpeechToText from './speechToText/speechToText';
import UserTable from './components/UserTable';
import JobNavbar from './Navbar/Navbar';
import Login from './Login/Login'
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom'

function App() {
  const [showUserTable, setShowUserTable] = useState(false);  // Add state to control UserTable visibility

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
      <div>{/* Fixed Navbar - Stays at the top but doesn't overlap */}
      <div style={{ position: "fixed", top: 0, width: "100%" }}>
        <div style={{zIndex:1000}}><JobNavbar /></div>
        <FilterComponent />
      </div>

      {/* Content Below the Navbar */}
      <div style={{ paddingTop: '280px', marginLeft: "400px" }}> {/* Add top padding equal to navbar height */}
          
      </div>
          
          </div>}
          />
          <Route path='/users' element={
            <UserTable/>
          }/>
          <Route path='/login' element={
            <Login/>
          }/>
        </Routes>
      </Router>
      
    </>
  );
}

export default App;
