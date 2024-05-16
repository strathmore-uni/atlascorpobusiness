import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from '../General Components/NavigationBar';
import { LuCameraOff } from "react-icons/lu";

const ReviewOrder = ({cartItems,totalPrice}) => {
    const location = useLocation();
    const formData = location.state?.formData || {};
    
    let shipping_fee= 40.00;
    let vat = (totalPrice*16/100); 
    let newPrice =vat+totalPrice+shipping_fee;
  return (
    <div >
        <div className='review_container' >

        <h1>Review Order</h1>

        <h3>User Information</h3>
      <p>Company Name: {formData.companyName}</p>
      <p>Title: {formData.title}</p>
      <p>First Name: {formData.firstName}</p>
      <p>Second Name: {formData.secondName}</p>
      <p>Address 1: {formData.address1}</p>
      <p>Address 2: {formData.address2}</p>
      <p>City: {formData.city}</p>
      <p>Zip Code: {formData.zip}</p>
      <p>Phone: {formData.phone}</p>
        </div>

        <div className='order_summary_checkout' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal</p>
<small className='cart_totalitemsprice' >${totalPrice+shipping_fee}</small>
<p>Shipping:<small style={{position:'absolute',right:'2rem'}} >${shipping_fee}</small></p>
<p>VAT:<small style={{position:'absolute',right:'2rem'}} >${vat}</small></p>
<p>Total:<small style={{position:'absolute',right:'2rem'}} >${newPrice}</small>  </p>
<button className='checkout_btn' >Go to Payment Details</button>
      </div>

        <div  className='productsdisplay_shoppingcart_review' >
        <h2 style={{ color: '#0078a1'}} >Cart Items</h2>
        <hr  className='hr_shoppingcartpage' />
        <small style={{position:'absolute',top:'5rem',left:'2rem',fontWeight:'500'}} > Description</small>
        <small  style={{position:'absolute',top:'5rem',right:'3rem',fontWeight:'500'}}>Total</small>
        <small  style={{position:'absolute',top:'5rem',left:'25rem',fontWeight:'500'}}>Net Price</small>
        <small  style={{position:'absolute',top:'5rem',right:'13rem',fontWeight:'500'}}>Qty</small>
           
        {cartItems.length === 0 && (
          <p className="cart_empty"> No items are added</p>
        )}
 {cartItems.map((item) => (
        <div key={item.id} className='display_cart' >
       

        <p className='lucameraoff_cart' ><LuCameraOff /></p>

          <div className='btngroup_cart' > 


                <p className='cart_quantity' >{item.quantity}</p>

          </div>
          <p className='p_serialnumber' >Serial Number:&nbsp;{item.partnumber}</p>
             <p style={{fontWeight:'bold',position:'absolute',left:'4rem'}}> {item.Description}</p>
             <p className='net_cart_itemprice' >$ {item.Price}</p>
             <p className='cart_itemprice' >$ {item.Price}</p>

          <hr className='hr_incartdisplay' />
          </div>
     

      ))}

    

      </div>
  

      <NavigationBar  />
    </div>
    
  );
};

export default ReviewOrder;