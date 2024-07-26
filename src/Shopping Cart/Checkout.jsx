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
        <Link to='/shop' className='arrowbacktocart' ><IoIosArrowBack  className='arrowbackCheckout'  />Back to Cart</Link>
<h4>Registration</h4>
<p className='shippingdetails' >Company Information</p>
        <div className='' >
      
      

     <Form  />

        </div>


<NavigationBar   />
<div className="shoppingcart_footer">
        <Footer />
      </div>
    </div>
  )
}
