import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationBar from "../General Components/NavigationBar";
import "./productdetails.css";
import { GrCart } from "react-icons/gr";
import { LuCameraOff } from "react-icons/lu";
import Footer from "../General Components/Footer";
import Notification from "../General Components/Notification";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useNavigate, useParams } from 'react-router-dom';
import Reviews from "./Reviews";
import ProductDescription from "./ProductDescription";
import ProductSpecification from "./ProductSpecification";

export default function ProductDetails({ productdetails, handleAddProduct, cartItems }) {
  const { currentUser } = useAuth();
  const { partnumber } = useParams();
  const [selectedImage, setSelectedImage] = useState(productdetails[0]?.image);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const { isAuthenticated } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleAddToCart = async (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }
  
    console.log('User Email:', currentUser.email); // Debugging
    console.log('Product Part Number:', product.partnumber); // Debugging
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/singlecart`, {
        partnumber: product.partnumber,
        quantity: 1,
        userEmail: currentUser.email, // Ensure userEmail is correctly set
        description: product.Description, // Include description
        price: product.Price // Include price
      });
      handleAddProduct(product);
      setNotificationMessage(`${product.Description} has been added to the cart.`);
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  
  
  
  
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [relatedProducts, setRelatedProducts] = useState([]);

  const productId = productdetails[0]?.id; // Assume this gets the product ID
  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/relatedproducts/${productId}`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };
  useEffect(() => {
    if (productId) {
      fetchQuestions();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/questions/${productId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = async () => {
    if (!currentUser) {
      alert('You need to be signed in to ask a question.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/questions`, {
        productId,
        questionText: newQuestion,
        userEmail: currentUser.email,
      });
      setNewQuestion('');
      fetchQuestions(); // Refresh questions
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!currentUser) {
      alert('You need to be signed in to answer a question.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/questions/answer`, {
        questionId,
        answerText: newAnswer,
        userEmail: currentUser.email,
      });
      setNewAnswer('');
      setSelectedQuestion(null);
      fetchQuestions(); // Refresh questions
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  return (
    <div className="productdetails_container">
      <div className="productview_container">
        {productdetails.map((product) => (
          <div className="product_details" key={product.partnumber}>
            <div className="productdetails_routes">
              <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
                {" "} Home &nbsp;/
              </a>
              <a href="/Shop" style={{ color: "#0078a1", textDecoration: "none" }}>
                &nbsp;Shop &nbsp;/
              </a>
              <p style={{ position: "absolute", left: "7.5rem", top: "0rem" }}>
                {product.Description}
              </p>
            </div>
            
            {!product.image && (
              <div className="noimage_div">
                <LuCameraOff />
              </div>
            )}
            <div className="image-gallery">
              <div className="big-image">
                {<img src={selectedImage} alt="Big" />}
              </div>
              <div className="thumbnails">
                {product.image && (
                  <img
                    src={product.image}
                    alt="Small 1"
                    onClick={() => handleImageClick(product.image)}
                  />
                )}
                {product.thumb1 && (
                  <img
                    src={product.thumb1}
                    alt="Small 2"
                    onClick={() => handleImageClick(product.thumb1)}
                  />
                )}
                {product.thumb2 && (
                  <img
                    src={product.thumb2}
                    alt="Small 3"
                    onClick={() => handleImageClick(product.thumb2)}
                  />
                )}
                {product.image4 && (
                  <img
                    src={product.image4}
                    alt="Small 4"
                    onClick={() => handleImageClick(product.image4)}
                  />
                )}
                {product.image5 && (
                  <img
                    src={product.image5}
                    alt="Small 5"
                    onClick={() => handleImageClick(product.image5)}
                  />
                )}
              </div>
            </div>
            
            <div className="productdetails_tabs">
              <button
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => handleTabChange('description')}
              >
                Description
              </button>
              <button
                className={activeTab === 'specification' ? 'active' : ''}
                onClick={() => handleTabChange('specification')}
              >
                Specification
              </button>
             
            </div>
            <hr className="tab_separator" />
            <div className="productdetails_content">
              {activeTab === 'description' && (
                <div>
                  
                  <ProductDescription productId={productId} />
                </div>
              )}
              {activeTab === 'specification' && (
                <div>
                  <ProductSpecification productId={productId} />
                </div>
              )}
          

            </div>
            
            <div className="pdrtdetails_card">
              <p className="productdetails_price"> USD {product.Price} </p>
              <h2 className="productdetails_title">{product.Description}</h2>
              <p className="productdetails_partnumber">Part Number: {product.partnumber}</p>

              <button className="addtocart_btn" onClick={() => handleAddToCart(product)}>
                <GrCart /> Add to cart
              </button>
              <div className="stock_status_prdtdetails">
                <div className={`status_indicator ${product.quantity > 0 ? "in_stock" : "out_of_stock"}`}></div>
                <p className="stock_status">
                  {product.quantity > 0 ? "In stock" : "Out of stock"}
                </p>
              </div>
            </div>
            <div className="review_section">
            <Reviews productId={productId} />
          </div>
            <div className="qa-section">
        <h3>Customer Questions & Answers</h3>
        
        {/* Display existing questions and answers */}
        {questions.map((question) => (
          <div key={question.id} className="question-item">
            <p className="question-text">{question.questionText} - <span className="question-user">{question.userEmail}</span></p>
            {question.answers.map((answer) => (
              <p key={answer.id} className="answer-text">Answer: {answer.answerText} - <span className="answer-user">{answer.userEmail}</span></p>
            ))}
            
            {/* Show answer input only if a question is selected */}
            {selectedQuestion === question.id ? (
              <div>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer..."
                />
                <button onClick={() => handleAddAnswer(question.id)}>Submit Answer</button>
              </div>
            ) : (
              <button onClick={() => setSelectedQuestion(question.id)}>Answer this question</button>
            )}
          </div>
        ))}

        {/* Add new question */}
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a new question..."
        />
        <button onClick={handleAddQuestion}>Submit Question</button>
      </div>
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-list">
          {relatedProducts.map(product => (
            <div key={product.id} className="related-product-item">
              <img src={product.image} alt={product.Description} />
              <p>{product.Description}</p>
              <p>USD {product.Price}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
          </div>
          
        ))}
  
       
      </div>
     
      {notificationMessage && (
        <Notification message={notificationMessage} />
      )}
      <NavigationBar />
  
    </div>
  );
}
