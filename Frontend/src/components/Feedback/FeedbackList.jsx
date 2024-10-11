import React, {useState, useEffect} from "react";

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
  
    useEffect(() => {
      fetch('/feedback')
        .then((res) => res.json())
        .then((data) => setFeedbacks(data))
        .catch((err) => console.error("Error fetching feedback", err));
    }, []);
  
    return (
      <div>
        {feedbacks.map((fb) => (
          <div key={fb._id}>
            <p>{fb.comments}</p>
            <p>Rating: {fb.rating}/5</p>
            <p>User: {fb.userId.name} ({fb.userId.email})</p>
          </div>
        ))}
      </div>
    );
  };
  export default FeedbackList;