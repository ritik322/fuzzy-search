import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ColorSchemesExample from "./Navbar/Navbar";
import FilterComponent from "./Filters/Filter";
import SpeechToText from './speechToText/speechToText';

function App() {
  const [showUserTable, setShowUserTable] = useState(false);  // Add state to control UserTable visibility

  return (
    <>
      {/* Fixed Navbar - Stays at the top but doesn't overlap */}
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <JobNavbar />
        <FilterComponent />
      </div>

      {/* Content Below the Navbar */}
      <div style={{ paddingTop: '280px', marginLeft: "400px" }}> {/* Add top padding equal to navbar height */}
          
      </div>
      
      
    </>
  );
}

export default App;
