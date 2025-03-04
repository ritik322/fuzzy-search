import React, {useState, useEffect} from "react";

const FeedbackForm = () => {
    const [comments, setComments] = useState("");
    const [rating, setRating] = useState(5);
  
    const submitFeedback = async () => {
      const response = await fetch('https://fuzzy-search-backend.vercel.app/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, comments, rating }),
      });
      if (response.ok) {
        alert("Feedback submitted successfully!");
      } else {
        alert("Error submitting feedback");
      }
    };
  
    return (
      <div>
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Enter feedback"></textarea>
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
        <button onClick={submitFeedback}>Submit Feedback</button>
      </div>
    );
  };

  export default FeedbackForm;