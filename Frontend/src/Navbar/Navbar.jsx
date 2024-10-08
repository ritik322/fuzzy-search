import React from "react";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import './Navbar.css';  // Import the custom CSS file
import TwoSearchBar from "../LanguageSelect/LanguageSelect";
import FilterComponent from "../Filters/Filter";
const JobNavbar = () => {
  return (
    <>
    <Navbar expand="lg" className="custom-navbar  ">
      <Container>
        {/* Left - Brand Logo */}
        <Navbar.Brand href="/">
          <img
            src=""
            alt="Logo"
            width="45"
            className="brand-logo"
          />
        </Navbar.Brand>

        {/* Collapse Button for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto custom-nav-links">
            <Nav.Link href="#find-jobs" className="nav-item">Home</Nav.Link>
            <Nav.Link href="#find-talent" className="nav-item">Table</Nav.Link>
            <Nav.Link href="#find-job" className="nav-item">Manage Users</Nav.Link>
            <Nav.Link href="#about-us" className="nav-item">Criminal Info</Nav.Link>
            <Nav.Link href="#about-us" className="nav-item">Import</Nav.Link>
            <Nav.Link href="#about-us" className="nav-item">Login</Nav.Link>
          </Nav>

          {/* Center - Search Bar */}
          

          {/* Right - Profile Section */}
          <Nav>
            <Nav.Link href="#profile" className="profile-section">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
                alt="Profile"
                width="45"
                className="profile-image"
              />
              <span className="profile-name">Fintan Cabrera</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div className="Lower-navbar"><p >Get Smart Name Recoginition</p>
    
    <TwoSearchBar/>
    </div>
    </Navbar>

   
    
     
     </>
     
  );
 
};

export default JobNavbar;
