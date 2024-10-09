import React, { useState } from 'react';

const SpeechToText = () => {
  

  // Initialize Speech Recognition
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
      setIsRecording(false);
    };
  };

  // Start recording
  const startRecording = () => {
    initializeRecognition();
    setIsRecording(true);
    recognition.start();
  };

  // Stop recording
  const stopRecording = () => {
    recognition.stop();
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      
      <label>
        Choose Language:
        {console.log("Hello")}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="hi-IN">Hindi</option>
          {/* Add more languages as needed */}
        </select>
      </label>
      
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechToText;
