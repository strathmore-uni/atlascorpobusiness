import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './checkout.css'

import Form from './Form';

export default function Checkout({totalPrice}) {
   

   
  return (
    <div className='checkout_container'>
        
<h4>Checkout</h4>
        <div className='' >
        <div className='order_summary' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal</p>
<small className='cart_totalitemsprice' >${totalPrice}</small>
<p>Shipping:</p>
<p>VAT:</p>
<button className='checkout_btn' >Go to Payment Details</button>
      </div>
      

     <Form  />

        </div>


<NavigationBar   />
    </div>
  )
}
