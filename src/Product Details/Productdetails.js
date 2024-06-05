import React, { useState } from "react";
import NavigationBar from "../General Components/NavigationBar";
import "./productdetails.css";
import { GrCart } from "react-icons/gr";
import { LuCameraOff } from "react-icons/lu";
import Footer from "../General Components/Footer";
import Notification from "../General Components/Notification";
import { useAuth } from "../MainOpeningpage/AuthContext";
import {  useNavigate } from 'react-router-dom';

export default function ProductDetails({
  productdetails,
  handleAddProduct,
  cartItems,
}) {
  const { currentUser } = useAuth(); 
  const [selectedImage, setSelectedImage] = useState();
  const [notificationMessage, setNotificationMessage] = useState('');
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
    }, 300
);
};

  return (
    <div className="productdetails_container" key={1}>
      <div className="productview_container">
        {productdetails.map((product) => (
          <div className="product_details" key={product.partnumber}>
            <div className="noimage_div"><LuCameraOff /></div>
            <div className="image-gallery">
              <div className="big-image">
                {selectedImage && <img src={selectedImage} alt="Big" />}
              </div>
              <div className="thumbnails">
                <img
                  src={product.image}
                  alt="Small 1"
                  onClick={() => handleImageClick(product.image)}
                />
                <img
                  src={product.image2}
                  alt="Small 2"
                  onClick={() => handleImageClick(product.image2)}
                />
                <img
                  src={product.image3}
                  alt="Small 3"
                  onClick={() => handleImageClick(product.image3)}
                />
                <img
                  src={product.image4}
                  alt="Small 4"
                  onClick={() => handleImageClick(product.image4)}
                />
                <img
                  src={product.image5}
                  alt="Small 5"
                  onClick={() => handleImageClick(product.image5)}
                />
              </div>
            </div>
            <div className="productdetails_routes">
              <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
                {" "} Home &nbsp;/
              </a>
              <a href="/Shop" style={{ color: "#0078a1", textDecoration: "none" }}>
                &nbsp;Shop &nbsp;/
              </a>
              <a href="/Shop/Filterelement" style={{ color: "#0078a1", textDecoration: "none" }}>
                &nbsp;Filter &nbsp;/
              </a>
              <p style={{ position: "absolute", left: "11rem", top: "-1rem" }}>
                {product.Description}
              </p>
            </div>
            <div className="pdrtdetails_card">
              <p className="productdetails_price"> USD {product.Price} </p>
              <h2 className="productdetails_title">{product.Description}</h2>
              <p className="productdetails_partnumber">Part Number: {product.partnumber}</p>
              <button className="addtocart_btn" onClick={() => handleAddToCart(product)}>
                <GrCart /> Add to cart
              </button>
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
