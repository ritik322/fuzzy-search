import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Navbar.css'; // Ensure to import your CSS file

function ColorSchemesExample() {
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
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                style={{ borderRadius: '20px', marginRight: '10px' }}
              />
              <Button variant="outline-light" className="btn-3d">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default ColorSchemesExample;
