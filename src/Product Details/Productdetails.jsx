import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationBar from "../General Components/NavigationBar";
import { GrCart } from "react-icons/gr";
import { LuCameraOff } from "react-icons/lu";
import Footer from "../General Components/Footer";
import Notification from "../General Components/Notification";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useCart } from "../App";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Reviews from "./Reviews";
import ProductDescription from "./ProductDescription";
import ProductSpecification from "./ProductSpecification";

export default function ProductDetails({ handleAddProductDetails, productdetails }) {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { partnumber } = useParams();
  const [selectedImage, setSelectedImage] = useState(productdetails[0]?.image);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const { isAuthenticated } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  const handleImageClick = (image) => setSelectedImage(image);

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    try {
      await addToCart(product, 1);
      setNotificationMessage(`${product.Description} has been added to the cart.`);
      setTimeout(() => setNotificationMessage(''), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotificationMessage('Failed to add item to cart. Please try again.');
      setTimeout(() => setNotificationMessage(''), 3000);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const productId = productdetails[0]?.id;

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
      fetchQuestions();
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
      fetchQuestions();
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productdetails.map((product) => (
          <div className="bg-white rounded-2xl shadow p-6 md:p-10 mb-8" key={product.partnumber}>
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-blue-700 mb-6 space-x-2" aria-label="Breadcrumb">
              <a href="/" className="hover:underline">Home</a>
              <span>/</span>
              <a href="/Shop" className="hover:underline">Shop</a>
              <span>/</span>
              <span className="font-semibold text-gray-800">{product.Description}</span>
            </nav>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Gallery */}
              <div className="flex flex-col gap-4 md:w-1/2">
                <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Big" className="object-contain w-full h-full" />
                  ) : (
                    <LuCameraOff className="text-6xl text-gray-400" />
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {[product.image, product.thumb1, product.thumb2, product.image4, product.image5].filter(Boolean).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${selectedImage === img ? 'border-blue-600' : 'border-transparent'} transition`}
                      onClick={() => handleImageClick(img)}
                    />
                  ))}
                </div>
              </div>
              {/* Product Info & Actions */}
              <div className="flex-1 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-1">{product.Description}</h2>
                <p className="text-gray-600 mb-2">Part Number: <span className="font-mono text-blue-700">{product.partnumber}</span></p>
                <p className="text-3xl font-extrabold text-blue-800 mb-4">USD {product.Price}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-3 h-3 rounded-full ${product.quantity > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-sm font-medium text-gray-600">{product.quantity > 0 ? "In stock" : "Out of stock"}</span>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity <= 0}
                >
                  <GrCart /> Add to cart
                </button>
                {notificationMessage && (
                  <div className="mt-2"><Notification message={notificationMessage} /></div>
                )}
                {/* Tabs */}
                <div className="flex gap-2 mt-6 mb-2">
                  <button
                    className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 ${activeTab === 'description' ? 'border-blue-700 text-blue-800 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-50'}`}
                    onClick={() => handleTabChange('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 ${activeTab === 'specification' ? 'border-blue-700 text-blue-800 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-50'}`}
                    onClick={() => handleTabChange('specification')}
                  >
                    Specification
                  </button>
                </div>
                <div className="bg-gray-50 rounded-b-lg p-4">
                  {activeTab === 'description' && <ProductDescription productId={productId} />}
                  {activeTab === 'specification' && <ProductSpecification productId={productId} />}
                </div>
              </div>
            </div>
            {/* Reviews Section */}
            <div className="mt-10">
              <Reviews productId={productId} />
            </div>
            {/* Q&A Section */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Customer Questions & Answers</h3>
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">{question.questionText}</p>
                        <p className="text-sm text-gray-600">Asked by: {question.userEmail}</p>
                        {question.answers && question.answers.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {question.answers.map((answer) => (
                              <div key={answer.id} className="bg-white rounded p-3 border-l-4 border-blue-500">
                                <p className="text-gray-800">{answer.answerText}</p>
                                <p className="text-sm text-gray-600 mt-1">Answered by: {answer.userEmail}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedQuestion === question.id ? (
                      <div className="mt-3">
                        <textarea
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          placeholder="Write your answer..."
                          className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAddAnswer(question.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Submit Answer
                          </button>
                          <button
                            onClick={() => setSelectedQuestion(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedQuestion(question.id)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Answer this question
                      </button>
                    )}
                  </div>
                ))}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Ask a Question</h4>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="What would you like to know about this product?"
                    className="w-full p-3 border border-blue-300 rounded-lg resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit Question
                  </button>
                </div>
              </div>
            </div>
            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Related Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.partnumber}
                      to={`/productdetails/${relatedProduct.partnumber}`}
                      onClick={() => handleAddProductDetails(relatedProduct)}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
                    >
                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.Description}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                          <LuCameraOff className="text-3xl text-gray-400" />
                        </div>
                      )}
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {relatedProduct.Description}
                      </h4>
                      <p className="text-blue-600 font-bold">${relatedProduct.Price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
