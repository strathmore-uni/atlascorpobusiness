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
  const { totalPrice, cartItems = [] } = location.state || { totalPrice: 0 };

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
      fetchAdminEmail(currentUser.email);
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
  const formattedTotalPrice = newPrice;

  const generateOrderNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderNumber = '';
    for (let i = 0; i < 10; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderNumber + Date.now();
  };

  // Test Invoice Ninja connection
  const testInvoiceNinja = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/api/send-invoice`, {
        client: {
          name: 'Test Client',
          email: 'mikekariuki10028@gmail.com',
          phone: '1234567890',
          address1: 'Test Address',
          city: 'Test City',
          zip: '12345',
          country: 'Kenya'
        },
        items: [{
          product_key: 'Test Product',
          notes: 'Test item for Invoice Ninja integration',
          cost: 100.00,
          quantity: 1,
        }],
        orderNumber: 'TEST-' + Date.now(),
        total: 100.00,
      });
      
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Invoice Ninja integration is working! Check your Invoice Ninja dashboard.',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('Invoice Ninja test failed:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Invoice Ninja test failed. Check console for details.',
        icon: 'error'
      });
    }
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
      
          // Set success message first
          setNotificationMessage('Order placed and confirmation emails sent successfully!');
          
          // Try to send invoice via Invoice Ninja (optional - don't block order placement)
          try {
            await axios.post(`${process.env.REACT_APP_LOCAL}/api/send-invoice`, {
              client: {
                name: userData.firstName + ' ' + userData.secondName,
                email: userData.email,
                phone: userData.phone,
                address1: userData.address1,
                address2: userData.address2,
                city: userData.city,
                zip: userData.zip,
                country: userData.country
              },
              items: cartItems.map(item => ({
                product_key: item.description || item.name,
                notes: `Part Number: ${item.partnumber}`,
                cost: parseFloat(item.price),
                quantity: parseInt(item.quantity),
              })),
              orderNumber,
              total: newPrice,
            });
            // Update message if invoice was sent successfully
            setNotificationMessage('Order placed, confirmation emails sent, and invoice sent to your email!');
          } catch (invoiceError) {
            console.error('Invoice Ninja error:', invoiceError);
            // Keep the original success message - invoice failure doesn't affect order placement
          }
        } else {
          console.error('Order placement failed:', response.data.message);
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar cartItems={cartItems} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white font-bold">1</span>
              <span className="text-xs mt-1 text-blue-700 font-semibold">Cart</span>
            </div>
            <span className="w-8 h-1 bg-blue-200 rounded"></span>
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white font-bold">2</span>
              <span className="text-xs mt-1 text-blue-700 font-semibold">Review</span>
            </div>
            <span className="w-8 h-1 bg-blue-200 rounded"></span>
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-500 font-bold">3</span>
              <span className="text-xs mt-1 text-gray-500 font-semibold">Payment</span>
            </div>
            <span className="w-8 h-1 bg-blue-200 rounded"></span>
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-500 font-bold">4</span>
              <span className="text-xs mt-1 text-gray-500 font-semibold">Confirmation</span>
            </div>
          </div>
        </div>
        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <section className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto max-h-[600px]">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No items are added</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.partnumber} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                      {item.image ? (
                        <img className="w-full h-full object-cover rounded" src={item.image} alt={item.description} />
                      ) : (
                        <LuCameraOff className="text-3xl text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.description}</p>
                      <p className="text-xs text-gray-500">Serial Number: {item.partnumber}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-blue-800 font-bold">${item.price}</span>
                      <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                      <span className="text-blue-900 font-bold">Total: ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Right: User Info & Order Summary */}
          <aside className="w-full lg:w-[350px] flex flex-col gap-8">
            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow p-6 mb-4 sticky top-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-blue-900">User Info</h2>
                <Link to="/userprofile" className="flex items-center gap-1 text-blue-700 hover:underline"><AiTwotoneEdit />Edit</Link>
              </div>
              <div className="text-gray-700 text-sm space-y-1">
                <div><span className="font-semibold">Name:</span> {userData.firstName} {userData.secondName}</div>
                <div><span className="font-semibold">Email:</span> {userData.email}</div>
                <div><span className="font-semibold">Phone:</span> {userData.phone}</div>
                <div><span className="font-semibold">Address:</span> {userData.address1}, {userData.address2}, {userData.city}, {userData.zip}</div>
                <div><span className="font-semibold">Country:</span> {userData.country}</div>
              </div>
            </div>
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow p-6 sticky top-44">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2"><span>Subtotal:</span><span className="font-semibold">${totalPrice}</span></div>
              <div className="flex justify-between mb-2"><span>Shipping:</span><span className="font-semibold">${shipping_fee}</span></div>
              <div className="flex justify-between mb-2"><span>VAT:</span><span className="font-semibold">${vat.toFixed(2)}</span></div>
              <div className="flex justify-between mb-4 text-lg"><span>Total:</span><span className="font-bold text-blue-800">${formattedTotalPrice}</span></div>
              <button
                className="w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
              >
                Place the Order
              </button>
              {/* Invoice Ninja test button temporarily disabled
              <button
                className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                onClick={testInvoiceNinja}
              >
                Test Invoice Ninja
              </button>
              */}
              {notificationMessage && <div className="mt-4"><Notification message={notificationMessage} /></div>}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewOrder;
