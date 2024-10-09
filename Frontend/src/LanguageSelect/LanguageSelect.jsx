import React, { useState, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaMicrophone } from 'react-icons/fa';
import './SearchBar.css';

function TwoSearchBar() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US'); // Default language
  let recognition;

  const initializeRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    recognition = new window.webkitSpeechRecognition();
    recognition.lang = language; // Set language dynamically
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Event: When speech is detected
    recognition.onresult = (event) => {
      const currentTranscript = event.results[event.resultIndex][0].transcript;
      setTranscript(currentTranscript);
    };

    // Event: When recording stops
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Start recording
  const startRecording = () => {
    setIsListening(true);
    initializeRecognition();
    recognition.start();
  };

  // Stop recording
  const stopRecording = () => {
    recognition.stop();
    setIsListening(false);
  };

  return (
    <>
      <Form className="d-flex justify-content-center align-items-center search-bar">
        <InputGroup className="mb-3" style={{ width: '100%' }}>
          <Form.Select
            aria-label="Search category"
            className="search-select"
            value={language} 
            onChange={(e)=>setLanguage(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="hi-IN">Hindi</option>
          
          </Form.Select>

          <Form.Control
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="search-input"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />

          <Button
            variant="outline-secondary"
            onClick={isListening ? stopRecording : startRecording}
          >
            <FaMicrophone />
          </Button>

          <Button variant="outline-success" className="search-button">
            Search
          </Button>
        </InputGroup>
      </Form>
    </>
  );
}

export default TwoSearchBar;
