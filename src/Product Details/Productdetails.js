import React, { useState } from "react";
import NavigationBar from "../General Components/NavigationBar";
import "./productdetails.css";
import { GrCart } from "react-icons/gr";
import { LuCameraOff } from "react-icons/lu";
import Footer from "../General Components/Footer";
import Notification from "../General Components/Notification";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function ProductDetails({
  productdetails,
  handleAddProduct,
  cartItems,
}) {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(productdetails[0]?.image);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description'); 
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    handleAddProduct(product);
    setNotificationMessage(`${product.Description} has been added to the cart.`);
    setTimeout(() => {
      setNotificationMessage('');
    }, 3000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
              <a href="/Shop/products" style={{ color: "#0078a1", textDecoration: "none" }}>
                &nbsp;Products &nbsp;/
              </a>
              <p style={{ position: "absolute", left: "12.5rem", top: "-1rem" }}>
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
              <button
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => handleTabChange('reviews')}
              >
                Reviews
              </button>
            </div>
            <hr className="tab_separator" />
            <div className="productdetails_content">
              {activeTab === 'description' && (
                <div>
                  
                  <p>Details about description for this product.</p>
                </div>
              )}
              {activeTab === 'specification' && (
                <div>
                  
                  <p>Product specifications go here.</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  
                  <p>Customer reviews and ratings.</p>
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
                        <div
                          className={`status_indicator ${product.quantity > 0 ? "in_stock" : "out_of_stock"}`}
                        ></div>
                        <div className="in_out_stock">
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                      
                      </div>
            </div>
          </div>
        ))}
      </div>
      <div className='productdetails_footer'>
        <Footer />
      </div>
      {notificationMessage && <Notification message={notificationMessage} />}
      <NavigationBar cartItems={cartItems} />
    </div>
  );
}
