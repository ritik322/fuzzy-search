import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import './SearchBar.css'; // Import your custom CSS

function TwoSearchBar() {
  return (
    <>
    <Form className="d-flex justify-content-center align-items-center search-bar">
      <InputGroup className="mb-3" style={{ width: '100%' }}> {/* Stretch input group to full width */}
        <Form.Select aria-label="Search category" className="search-select">
          <option>Select Category</option>
          <option value="1">Jobs</option>
          <option value="2">Companies</option>
          <option value="3">Locations</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="search-input"
        />

        <Button variant="outline-success" className="search-button">
          Search
        </Button>
      </InputGroup>
    </Form>
    
    </>
  );
}

export default TwoSearchBar;
