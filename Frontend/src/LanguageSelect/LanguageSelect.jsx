import React, { useState, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaMicrophone } from 'react-icons/fa';
import './SearchBar.css';

function TwoSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('hi-IN'); // Default to Hindi
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Function to start listening and recording audio
  const startListening = () => {
    setIsListening(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  };

  // Function to stop listening and recording audio
  const stopListening = () => {
    setIsListening(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stops recording and triggers onstop
    }
  };

  // Function to send recorded audio to the backend
  const sendAudioToBackend = (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language); // Send selected language to backend

    fetch('http://127.0.0.1:5000/record', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',  // Add this header
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.text) {
          setSearchQuery(data.text); // Display translated text in English
        } else {
          console.error('Error recognizing speech:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error sending audio to backend:', error);
      });
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Update selected language
  };

  return (
    <>
      <Form className="d-flex justify-content-center align-items-center search-bar">
        <InputGroup className="mb-3" style={{ width: '100%' }}>
          <Form.Select
            aria-label="Search category"
            className="search-select"
            onChange={handleLanguageChange}
          >
            <option value="hi-IN">Hindi</option>
            <option value="pa-IN">Punjabi</option>
            <option value="en-US">English</option>
          </Form.Select>

          <Form.Control
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Button
            variant="outline-secondary"
            onClick={isListening ? stopListening : startListening}
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
