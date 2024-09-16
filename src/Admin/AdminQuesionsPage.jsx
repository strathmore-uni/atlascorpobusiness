import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../MainOpeningpage/AuthContext';
import './AdminQuestions.css'; // Ensure your CSS file is imported
import { FaStar, FaRegStar } from 'react-icons/fa'; // Font Awesome star icons

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/questions`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAddAnswer = async (questionId) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/questions/answer`, {
        questionId,
        answerText: newAnswer,
        userEmail: currentUser.email,
      });
      setNewAnswer('');
      setSelectedQuestion(null);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  const handleStar = async (questionId) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/questions/star`, { questionId });
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error starring question:', error);
    }
  };

  const handleUnstar = async (questionId) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/questions/unstar`, { questionId });
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error unstarring question:', error);
    }
  };

  return (
    <div className="admin-questions-page">
      <h2 className="page-title">Admin Question Management</h2>
      <div className="questions-container">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="star-icon">
              {question.starred ? (
                <FaStar onClick={() => handleUnstar(question.id)} />
              ) : (
                <FaRegStar onClick={() => handleStar(question.id)} />
              )}
            </div>
            <div className="product-info">
              <h3>Product: {question.partnumber}</h3>
              <p className="product-description">Description: {question.Description}</p>
            </div>
            <div className="question-text">
              <h4>Question: {question.questionText} - <span>{question.userEmail}</span></h4>
            </div>
            {question.answers.map((answer) => (
              <p key={answer.id} className="answer-item">Answer: {answer.answerText} - <span>{answer.userEmail}</span></p>
            ))}
            <div className="question-actions">
              {selectedQuestion === question.id ? (
                <div className="answer-form">
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                  />
                  <button className="submit-button" onClick={() => handleAddAnswer(question.id)}>Submit Answer</button>
                </div>
              ) : (
                <button className="answer-button" onClick={() => setSelectedQuestion(question.id)}>Answer this question</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuestionsPage;
