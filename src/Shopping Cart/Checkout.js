import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './checkout.css'

import Form from './Form';
import Footer from '../General Components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

export default function Checkout({totalPrice,cartItems}) {
   

   
  return (
    <div className='checkout_container'>
        <Link to='/Cart' className='arrowbacktocart' ><IoIosArrowBack  className='arrowbackCheckout'  />Back to Cart</Link>
<h4>Checkout</h4>
<p className='shippingdetails' >Shipping Details</p>
        <div className='' >
        <div className='order_summary_checkout' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal</p>
<small className='cart_totalitemsprice' >${totalPrice}</small>
<p>Shipping:</p>
<p>VAT:</p>

      </div>
      

     <Form  />

        </div>


<NavigationBar   />
<div className="shoppingcart_footer">
        <Footer />
      </div>
    </div>
  )
}
