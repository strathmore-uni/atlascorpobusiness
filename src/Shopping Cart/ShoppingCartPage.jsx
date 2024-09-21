import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuCameraOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import "./shoppingcartpage.css";
import NavigationBar from "../General Components/NavigationBar";
import { useAuth } from "../MainOpeningpage/AuthContext";
import ReviewOrder from "./ReviewOrder";
import Footer from "../General Components/Footer";

export default function ShoppingCartPage({
  handleRemoveProduct,
  handleRemoveSingleProduct,
  handleCartClearance,
  
}) {
  const [quickOrderCode, setQuickOrderCode] = useState('');
  const [quickOrderQty, setQuickOrderQty] = useState(1);
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    // Calculate the total price whenever cartItems changes
    const calculateTotalPrice = () => {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(total.toFixed(2)); // Ensure the total price has two decimal places
    };

    calculateTotalPrice();
  }, [cartItems]);

  const handleCheckout = () => {
    navigate('/review-order', { state: { cartItems,totalPrice } });
  };
  const handleAddProduct = (product) => {
    const existingProduct = cartItems.find(item => item.partnumber === product.partnumber);
    if (existingProduct) {
      setCartItems(cartItems.map(item =>
        item.partnumber === product.partnumber
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, product]);
    }
  };

  const handleQuickOrderSubmit = async () => {
    if (!quickOrderCode || quickOrderQty <= 0) {
      alert("Please enter a valid product code and quantity.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/products/partnumber/${quickOrderCode}`);
      const product = response.data;

      if (product) {
        handleAddProduct({ ...product, quantity: quickOrderQty });
        setQuickOrderCode("");
        setQuickOrderQty(1);
      } else {
        alert("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product. Please try again.");
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser || !currentUser.email) {
        console.warn('No current user or email available.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/cart`, {
          params: { email: currentUser.email } // Pass email as query parameter
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  const handleRemoveFromCart = async (partnumber) => {
    if (!currentUser || !currentUser.email) {
      console.warn('No current user or email available.');
      return;
    }
  
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL}/api/cart/${partnumber}`, {
        params: { email: currentUser.email } // Pass email as query parameter
      });
      
      // Update cart items after successful deletion
      setCartItems(cartItems.filter(item => item.partnumber !== partnumber));
      handleRemoveProduct(partnumber); // Ensure this is correctly updating the state or performing the action
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  
  const handleClearCartClick = async () => {
    if (!currentUser || !currentUser.email) {
      console.warn('No current user or email available.');
      return;
    }
  
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        params: { email: currentUser.email } // Pass email as query parameter
      });
      setCartItems([]);
      handleCartClearance(); // Ensure this function updates UI or state appropriately
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  const handleIncreaseQuantity = (partnumber) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map(item =>
        item.partnumber === partnumber
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  
  const handleDecreaseQuantity = (partnumber) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map(item =>
        item.partnumber === partnumber
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Prevent going below 1
          : item
      )
    );
  };
  
  

  return (
    <div className="shoppingcartpage_container">
      <div className="productsdisplay_shoppingcart">
        <div>
          <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
            {" "}
            Home &nbsp;/
          </a>
          <a href="/shop" style={{ color: "#0078a1", textDecoration: "none" }}>
            &nbsp;Shop &nbsp;/
          </a>
          <p
            style={{
              position: "absolute",
              left: "7.5rem",
              top: "0rem",
              color: "#0078a1",
            }}
          >
            &nbsp;Cart &nbsp;
          </p>
        </div>
        <h2 style={{ color: "#0078a1" }}>Cart Items</h2>
        <button className="btn_clearcart" onClick={handleClearCartClick}>
          Clear Cart
          <RiDeleteBinLine className="deleteicon" />
        </button>
        <hr className="hr_shoppingcartpage" />
        <small className="table_description">Description</small>
        <small className="total_cart_table" style={{ position: "absolute", top: "5rem", right: "3rem", fontWeight: "500" }}>Total</small>
        <small className="netprice_cart">Net Price</small>
        <small className="qty_cart">Qty</small>

        {cartItems.length === 0 && (
          <p className="cart_empty"> No items are added</p>
        )}
        {cartItems.map((item) => (
          <div key={item.partnumber} className="display_cart">
            {item.image ? (
              <img className="prdt_image_shopping" src={item.image} alt="" />
            ) : (
              <p className="cameraoff_icon">
                <LuCameraOff />
              </p>
            )}

            <div className="btngroup_cart">
              <button className="increase-item" onClick={() => handleIncreaseQuantity(item.partnumber)}>
                +
              </button>
              <p className="cart_quantity">{item.quantity}</p>
              <button className="decrease-item" onClick={() => handleDecreaseQuantity(item.partnumber)}>
                -
              </button>
            </div>
            <p className="p_serialnumber">Part Number:&nbsp;{item.partnumber}</p>
            <p className="cart_item_title">{item.description}</p>
            <p className="net_cart_itemprice">$ {item.price}</p>
            <p className="cart_itemprice">$ {item.price}</p>

            <p className="cart_removeitem" onClick={() => handleRemoveFromCart(item.partnumber)}>
              Remove
              <RiDeleteBinLine />
            </p>
            <hr className="hr_incartdisplay" />
          </div>
        ))}
      </div>

      <div className="order_summary">
        <p>Order Summary</p>
        <p className="p_carttotal">Subtotal:</p>
        <small className="cart_totalitemsprice">${totalPrice}</small>
        <p>Shipping:</p>
        <p>VAT:</p>

          <button className="checkout_btn" onClick={handleCheckout} >Go to Checkout</button>
       
      </div>

      <div className="quick_search">
        <h2>Quick Order</h2>
        <label className="code_label">Product code</label>
        <input
          type="text"
          placeholder="Product Code"
          className="quick_input"
          value={quickOrderCode}
          onChange={(e) => setQuickOrderCode(e.target.value)}
        />

        <label className="qty_label">Qty</label>
        <input
          type="number"
          placeholder="Quantity"
          className="quick_qty"
          value={quickOrderQty}
          onChange={(e) => setQuickOrderQty(parseInt(e.target.value))}
        />

        <button className="quick_addtocart" onClick={handleQuickOrderSubmit}>
          Add to cart
        </button>
      </div>
      <div className="cantfind">
        <h3>Can’t find what you are looking for?</h3>
        <p>Missing a product on the webshop? Contact our customer center.</p>
        <p>Email:</p>
        <a href="mailto:power.technique.uk@atlascopco.com">power.technique.uk@atlascopco.com</a>
      </div>
      <div className="shoppingcart_footer">
        <Footer />
      </div>
      <NavigationBar cartItems={cartItems} />
    </div>
  );
}
