import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from '../General Components/NavigationBar';
import { LuCameraOff } from 'react-icons/lu';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { AiTwotoneEdit } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import Footer from '../General Components/Footer';
import Notification from '../General Components/Notification';
import { useAuth } from '../MainOpeningpage/AuthContext';
import Swal from 'sweetalert2';

const ReviewOrder = () => {
  const [userData, setUserData] = useState({});
  const [notificationMessage, setNotificationMessage] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const { currentUser } = useAuth();


  const location = useLocation();
  const { totalPrice, cartItems=[] } = location.state || { totalPrice: 0 };

  // Function to fetch the admin email
  const fetchAdminEmail = async (userEmail) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin-email`, {
        params: { userEmail }
      });
      setAdminEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching admin email:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchAdminEmail(currentUser.email); // Fetch admin email based on the current user's email
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user`, {
          params: { email: currentUser.email }
        });
        setUserData(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (currentUser?.email) {
      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser?.email) {
        console.warn('No current user or email available.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/cart`, {
          params: { email: currentUser.email }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  const numericTotalPrice = Number(totalPrice); 


  const shipping_fee = 40;
  const vat = numericTotalPrice * 0.10;
  const newPrice = numericTotalPrice + vat + shipping_fee;

  const formattedTotalPrice = newPrice;  // Ensure two decimal places


  const generateOrderNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderNumber = '';
    for (let i = 0; i < 10; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderNumber + Date.now();
  };



  const handlePlaceOrder = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to place this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, place the order!',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      const orderNumber = generateOrderNumber();
  
      // Define cartItemsDetails
      const cartItemsDetails = cartItems.map(item => 
        `Product: ${item.name}, Quantity: ${item.quantity}, Price: $${item.price}`
      ).join('\n');
  
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
          // Prepare email data for the client
          const clientEmailData = {
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
  
          // Prepare email data for the admin
          const adminEmailData = {
            to_email: adminEmail,
            to_name: 'Admin',
            subject: `New Order Placed - ${orderNumber}`,
            message: `
              New order placed by ${userData.firstName} ${userData.secondName}.

              Details:
              

              From: ${userData.firstName}

              Email: ${userData.email}
  
              Cart Items:
              ${cartItemsDetails}
  
              Order Number: ${orderNumber}
              Total Amount: $${newPrice.toFixed(2)}
  
              Shipping Address:
              ${userData.address1}, ${userData.address2}, ${userData.city}, ${userData.zip}
  
              User Details:
              Name: ${userData.firstName} ${userData.secondName}
              Email: ${userData.email}
              Phone: ${userData.phone}
  
              Please review the order and proceed with the next steps.
            `
          };
  
          await emailjs.send('service_bmvwx28', 'template_zsdszy8', clientEmailData, 'KeePPXIGkpTcoiTBJ');
          await emailjs.send('service_ie3g4m5', 'template_igi5iov', adminEmailData, 'HSw7Ydql4N9nzAoVn');
      
          setNotificationMessage('Order placed and confirmation emails sent to you and the admin.');
        } else {
          console.error('Order placement failed:', response.data.message);
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    }
  };
  

  return (
    <div>
      <div className='review_container'>
        <Link to='/shop' className='backtoform'>
          <p><IoIosArrowBack className='arrowbackReview' />Back</p>
        </Link>
        <Link to='/userprofile' className='editinfo'>
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
        <p>Country: {userData.country}</p>
      </div>

      <div className='order_summary_checkout'>
        <p>Order Summary</p>
        <p className='p_carttotal'>Subtotal</p>
        <small className='cart_totalitemsprice'>${totalPrice}</small>
        <p>Shipping: <small style={{ position: 'absolute', right: '2rem' }}>${shipping_fee}</small></p>
        <p>VAT: <small style={{ position: 'absolute', right: '2rem' }}>${vat}</small></p>
        <p>Total: <small style={{ position: 'absolute', right: '2rem' }}>${formattedTotalPrice}</small></p>
        <button className='checkout_btn' onClick={handlePlaceOrder}>Place the Order</button>
      </div>

      <div className='productsdisplay_shoppingcart_review'>
        <h2 style={{ color: '#0078a1' }}>Cart Items</h2>
        <hr className='hr_shoppingcartpage' />
        <small className='tbl_description' style={{ position: 'absolute', top: '3rem', left: '5rem', fontWeight: '500' }}>Description</small>
        <small className='tbl_total' style={{ position: 'absolute', top: '3rem', right: '1rem', fontWeight: '500' }}>Total</small>
        <small className='tbl_net' style={{ position: 'absolute', top: '3rem', left: '25rem', fontWeight: '500' }}>Net Price</small>
        <small className='tbl_qty' style={{ position: 'absolute', top: '3rem', right: '15rem', fontWeight: '500' }}>Qty</small>

        {cartItems.length === 0 && (
          <p className="cart_empty">No items are added</p>
        )}
        {cartItems.map((item) => (
          <div key={item.partnumber} className='display_cart'>
            <p className='lucameraoff_cart'><LuCameraOff /></p>
            <div className='btngroup_cart'>
              <p className='cart_quantity_review'>{item.quantity}</p>
            </div>
            <p className='p_serialnumber'>Serial Number:&nbsp;{item.partnumber}</p>
            <p className='p_description'>{item.description}</p>
            <p className='net_cart_itemprice_revieworder'>${item.price}</p>
            <p className='cart_itemprice_revieworder'>${item.price * item.quantity}</p>
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
