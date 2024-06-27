import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../General Components/NavigationBar';
import { LuCameraOff } from "react-icons/lu";
import axios from 'axios';
import emailjs from 'emailjs-com';
import { AiTwotoneEdit } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import Footer from '../General Components/Footer';
import Notification from '../General Components/Notification';

const ReviewOrder = ({ cartItems, totalPrice }) => {
  const [userData, setUserData] = useState({});
  const [notificationMessage, setNotificationMessage] = useState('');

  const userEmail = localStorage.getItem('userEmail');
  console.log('User Email:', userEmail);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/?email=${userEmail}`);
        setUserData(response.data);
        console.log(userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userEmail]);

  let shipping_fee = 40.00;
  let vat = (totalPrice * 0.16);
  let newPrice = totalPrice + vat + shipping_fee;

  const generateOrderNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderNumber = '';
    for (let i = 0; i < 10; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderNumber + Date.now();
  };

  const handlePlaceOrder = async () => {
    const orderNumber = generateOrderNumber();
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/api/order`, {
        formData: userData,
        cartItems,
        totalPrice,
        shipping_fee,
        vat,
        newPrice,
        orderNumber
      });

      if (response.data.message === 'Order placed successfully') {
        const cartItemsDetails = cartItems.map(item => {
          return `Item: ${item.Description}, Quantity: ${item.quantity}, Price: $${item.Price}`;
        }).join('\n');

        // Send confirmation email
        const emailData = {
          to_email: userData.email,
          to_name: userData.firstName,
          subject: `Order Confirmation - ${orderNumber}`,
          message: `
            Dear ${userData.firstName},
            
            Thank you for your order. Here are the details:
            
            Cart Items: 
            ${cartItemsDetails}

            
            Order Number: ${orderNumber}
            Total Amount: $${newPrice.toFixed(2)}
            
            Shipping Address:
            ${userData.address1}, ${userData.address2}, ${userData.city}, ${userData.zip}
            
            Best regards,
            Your Company Name
          `
        };

        emailjs.send('service_bmvwx28', 'template_zsdszy8', emailData, 'KeePPXIGkpTcoiTBJ')
          .then((result) => {
            setNotificationMessage('Order placed and confirmation email sent.');
          }, (error) => {
            console.error('Email sending failed:', error);
          });
      } else {
        console.error('Order placement failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div>
      <div className='review_container'>
        <Link to='/Checkout' className='backtoform'>
          <p><IoIosArrowBack className='arrowbackReview' />Back</p>
        </Link>
        <Link to='/Checkout' className='editinfo'>
          <p>Edit Info<AiTwotoneEdit /></p>
        </Link>
        
        <h1>Review Order</h1>
        <h3>User Information</h3>
        <p>Company Name: {userData.companyName}</p>
        <p>Title: {userData.title}</p>
        <p>First Name: {userData.firstName}</p>
        <p>Second Name: {userData.secondName}</p>
        <p>Address 1: {userData.address1}</p>
        <p>Address 2: {userData.address2}</p>
        <p>City: {userData.city}</p>
        <p>Zip Code: {userData.zip}</p>
        <p>Phone: {userData.phone}</p>
        <p>Email: {userData.email}</p>
      </div>

      <div className='order_summary_checkout'>
        <p>Order Summary</p>
        <p className='p_carttotal'>Subtotal</p>
        <small className='cart_totalitemsprice'>${totalPrice}</small>
        <p>Shipping: <small style={{ position: 'absolute', right: '2rem' }}>${shipping_fee}</small></p>
        <p>VAT: <small style={{ position: 'absolute', right: '2rem' }}>${vat.toFixed(2)}</small></p>
        <p>Total: <small style={{ position: 'absolute', right: '2rem' }}>${newPrice.toFixed(2)}</small></p>
        <button className='checkout_btn' onClick={handlePlaceOrder}>Place the Order</button>
      </div>

      <div className='productsdisplay_shoppingcart_review'>
        <h2 style={{ color: '#0078a1' }}>Cart Items</h2>
        <hr className='hr_shoppingcartpage' />
        <small className='tbl_description' style={{ position: 'absolute', top: '5rem', left: '2rem', fontWeight: '500' }}>Description</small>
        <small className='tbl_total' style={{ position: 'absolute', top: '5rem', right: '3rem', fontWeight: '500' }}>Total</small>
        <small className='tbl_net' style={{ position: 'absolute', top: '5rem', left: '25rem', fontWeight: '500' }}>Net Price</small>
        <small className='tbl_qty' style={{ position: 'absolute', top: '5rem', right: '13rem', fontWeight: '500' }}>Qty</small>

        {cartItems.length === 0 && (
          <p className="cart_empty">No items are added</p>
        )}
        {cartItems.map((item) => (
          <div key={item.id} className='display_cart'>
            <p className='lucameraoff_cart'><LuCameraOff /></p>
            <div className='btngroup_cart'>
              <p className='cart_quantity_review'>{item.quantity}</p>
            </div>
            <p className='p_serialnumber'>Serial Number:&nbsp;{item.partnumber}</p>
            <p style={{ fontWeight: 'bold', position: 'absolute', left: '4rem' }}>{item.Description}</p>
            <p className='net_cart_itemprice_revieworder'>${item.Price}</p>
            <p className='cart_itemprice_revieworder'>${item.Price}</p>
            <hr className='hr_incartdisplay' />
          </div>
        ))}
      </div>
      <div className="shoppingcart_footer">
        <Footer />
      </div>
      {notificationMessage && <Notification message={notificationMessage} />}
      <NavigationBar />
    </div>
  );
};

export default ReviewOrder;
