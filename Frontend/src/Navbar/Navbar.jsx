import React, { useState } from 'react';
import { Container, Nav, Navbar, Button, Form, NavDropdown } from 'react-bootstrap';
import './Navbar.css'; // Ensure to import your CSS file

function ColorSchemesExample({ user, onLogout, onLogin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLink, setActiveLink] = useState('home'); // State to track the active link

  const handleLogin = () => {
    if (username) {
      onLogin(username); // Call the onLogin function passed from the parent to set the user
    }
  };

  return (
    <>
      <Navbar className="navbar-3d" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="navbar-brand">
            Stocker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                href="#home" 
                className={activeLink === 'home' ? 'active' : ''} 
                onClick={() => setActiveLink('home')}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                href="#table" 
                className={activeLink === 'table' ? 'active' : ''} 
                onClick={() => setActiveLink('table')}
              >
                Table
              </Nav.Link>
              <Nav.Link 
                href="#manage-users" 
                className={activeLink === 'manage-users' ? 'active' : ''} 
                onClick={() => setActiveLink('manage-users')}
              >
                Manage Users
              </Nav.Link>
              <Nav.Link 
                href="#criminal-info" 
                className={activeLink === 'criminal-info' ? 'active' : ''} 
                onClick={() => setActiveLink('criminal-info')}
              >
                Criminal Info
              </Nav.Link>
              <Nav.Link 
                href="#import" 
                className={activeLink === 'import' ? 'active' : ''} 
                onClick={() => setActiveLink('import')}
              >
                Import
              </Nav.Link>
            </Nav>

            {/* Search Bar */}
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                style={{ borderRadius: '20px', marginRight: '10px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-light" className="btn-3d">Search</Button>
            </Form>

            {/* User Profile / Login Section */}
            <Nav>
              {user.isLoggedIn ? (
                <NavDropdown
                  title={
                    <>
                      <img
                        src="https://via.placeholder.com/35"
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '35px', height: '35px', marginRight: '10px' }}
                      />
                      {user.name}
                    </>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button variant="outline-light" className="btn-3d" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
