import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import JobNavbar  from "./Navbar/Navbar";
import FilterComponent from "./Filters/Filter";
import SpeechToText from './speechToText/speechToText';

function App() {
  return (
    <>
      {/* Fixed Navbar - Stays at the top but doesn't overlap */}
      <div style={{ top: 0, width: "100%", zIndex: 1000 }}>
        <JobNavbar />
        <FilterComponent />
      </div>

      {/* Content Below the Navbar */}
      <div style={{ paddingTop: '280px', zIndex: 1000, marginLeft: "400px" }}> {/* Add top padding equal to navbar height */}
      <SpeechToText/>
      </div>
      
      
    </>
  );
}

export default App;
