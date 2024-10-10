import { Feedback } from "../Models/feedback.model";

// Feedback Routes
const addFeedback = async (req, res) => {
    try {
      const { userId, comments, rating } = req.body;
      const newFeedback = await Feedback.create({ userId, comments, rating });
      res.status(201).json({ message: "Feedback submitted", feedback: newFeedback });
    } catch (error) {
      res.status(500).json({ message: "Error submitting feedback", error });
    }
  };
  
  const getFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().populate('userId', 'name email');
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback", error });
    }
  };
  
  export {addFeedback, getFeedback};