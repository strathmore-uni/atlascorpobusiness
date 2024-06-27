import React, { useState } from "react";
import axios from "axios";
import { LuCameraOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Footer from "../General Components/Footer";
import "./shoppingcartpage.css";
import NavigationBar from "../General Components/NavigationBar";

export default function ShoppingCartPage({
  cartItems,
  quotationItems,
  handleRemoveProduct,
  handleRemoveSingleProduct,
  handleAddProduct,
  handleCartClearance,
  handleAddQuotationProduct,
  handleRemoveQuotationProduct,
  totalPrice,
  handleRemoveSingleQuotationProduct,
}) {
  const [quickOrderCode, setQuickOrderCode] = useState('');
  const [quickOrderQty, setQuickOrderQty] = useState(1);

 
  const handleQuickOrderSubmit = async () => {
    if (!quickOrderCode || quickOrderQty <= 0) {
      alert("Please enter a valid product code and quantity.");
      return;
    }
  
    const userEmail = localStorage.getItem("userEmail");
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/products/partnumber/${quickOrderCode}`, {
        params: {
          email: userEmail,
        },
      });
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
              top: "-1rem",
              color: "#0078a1",
            }}
          >
            &nbsp;Cart &nbsp;
          </p>
        </div>
        <h2 style={{ color: "#0078a1" }}>Cart Items</h2>
        <button className="btn_clearcart" onClick={handleCartClearance}>
          Clear Cart
          <RiDeleteBinLine className="deleteicon" />
        </button>
        <hr className="hr_shoppingcartpage" />
        <small
        className="table_description"
        
        >
          {" "}
          Description
        </small>
        <small
        className="total_cart_table"
          style={{
            position: "absolute",
            top: "5rem",
            right: "3rem",
            fontWeight: "500",
          }}
        >
          Total
        </small>
        <small
        className="netprice_cart"
    
        >
          Net Price
        </small>
        <small
        className="qty_cart"
         
        >
          Qty
        </small>

        {cartItems.length === 0 && (
          <p className="cart_empty"> No items are added</p>
        )}
        {cartItems.map((item) => (
          <div key={item.partnumber} className="display_cart">
            <p className="lucameraoff_cart">
              <LuCameraOff />
            </p>

            <div className="btngroup_cart">
              <button
                className="increase-item"
                onClick={() => handleAddProduct(item)}
              >
                +
              </button>
              <p className="cart_quantity">{item.quantity}</p>
              <button
                className="decrease-item"
                onClick={() => handleRemoveProduct(item)}
              >
                -
              </button>
            </div>
            <p className="p_serialnumber">
              Part Number:&nbsp;{item.partnumber}
            </p>
            <p className="cart_item_title"
             
            >
              {" "}
              {item.Description}
            </p>
            <p className="net_cart_itemprice">$ {item.Price}</p>
            <p className="cart_itemprice">$ {item.Price}</p>

            <p
              className="cart_removeitem"
              onClick={() => handleRemoveSingleProduct(item)}
            >
              {" "}
              <RiDeleteBinLine />
            </p>
            <hr className="hr_incartdisplay" />
          </div>
        ))}

        {quotationItems.length > 0 && (
          <div className="quotation_items">
            <h2>Quotation Items</h2>
            {quotationItems.map((item) => (
              <div key={item.partnumber} className="display_cart">
                <p className="lucameraoff_cart">
                  <LuCameraOff />
                </p>

                <div className="btngroup_cart">
                  <button
                    className="increase-item"
                    onClick={() => handleAddQuotationProduct(item)}
                  >
                    +
                  </button>
                  <p className="cart_quantity">{item.quantity}</p>
                  <button
                    className="decrease-item"
                    onClick={() => handleRemoveQuotationProduct(item)}
                  >
                    -
                  </button>
                </div>
                <p className="p_serialnumber">
                  Part Number:&nbsp;{item.partnumber}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    position: "absolute",
                    left: "4rem",
                  }}
                >
                  {" "}
                  {item.Description}
                </p>
                <p className="net_cart_itemprice">$ {item.Price}</p>
                <p className="cart_itemprice">$ {item.Price}</p>

                <p
                  className="cart_removeitem"
                  onClick={() => handleRemoveSingleQuotationProduct(item)}
                >
                  {" "}
                  <RiDeleteBinLine />
                </p>
                <hr className="hr_incartdisplay" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order_summary">
        <p>Order Summary</p>
        <p className="p_carttotal">Subtotal:</p>
        <small className="cart_totalitemsprice">${totalPrice}</small>
        <p>Shipping:</p>
        <p>VAT:</p>

        <Link to="/review-order">
          <button className="checkout_btn">Go to Checkout</button>
        </Link>
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
      <div className="cantfind" >
<h3>Can’t find what you are looking for?</h3>
<p>Missing a product on the webshop? Contact our customer center.</p>
<p>Email:</p>
<a href="power.technique.uk@atlascopco.com" >power.technique.uk@atlascopco.com</a>
      </div>

      <div className="shoppingcart_footer">
        <Footer />
      </div>

      <NavigationBar cartItems={cartItems} />
    </div>
  );
}
