import React from 'react'
import NavigationBar from '../General Components/NavigationBar'


export default function Delivery({totalPrice}) {
  let shipping_fee= 40.00;
  let vat = (totalPrice*16/100); 
  let newPrice =vat+totalPrice+shipping_fee;
  return (
    <div>
      
              
<h4>Checkout</h4>

        <div className='' >
        <div className='order_summary_checkout' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal</p>
<small className='cart_totalitemsprice' >${totalPrice+shipping_fee}</small>
<p>Shipping:<small style={{position:'absolute',right:'2rem'}} >${shipping_fee}</small></p>
<p>VAT:<small style={{position:'absolute',right:'2rem'}} >${vat}</small></p>
<p>Total:<small style={{position:'absolute',right:'2rem'}} >${newPrice}</small>  </p>
<button className='checkout_btn' >Go to Payment Details</button>
      </div>
      
      <h4 className='h4_deliverymode'>Delivery Mode</h4>

      <p className='p_deliverymode'>The way your order will be processed by our logistics team</p>

      </div>
 
   <NavigationBar  />
    </div>
  )
}
