import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './shoppingcartpage.css'
import { LuCameraOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from 'react-router-dom';


export default function ShoppingCartPage({cartItems,handleRemoveProduct,handleAddProduct,handleCartClearance,totalPrice}) {


  return (
    <div className='shoppingcartpage_container' >
      <div  className='productsdisplay_shoppingcart' >
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


            <button
                  className="increase-item"
                  onClick={() => handleAddProduct(item)}
                >
                  +
                </button>
                <p className='cart_quantity' >{item.quantity}</p>
                <button
                  className="decrease-item"
                  onClick={() => handleRemoveProduct(item)}
                >
                  -
                </button>
          </div>
          <p className='p_serialnumber' >Serial Number:&nbsp;{item.partnumber}</p>
             <p style={{fontWeight:'bold',position:'absolute',left:'4rem'}}> {item.Description}</p>
             <p className='net_cart_itemprice' >$ {item.Price}</p>
             <p className='cart_itemprice' >$ {item.Price}</p>

             <p className='cart_removeitem'  onClick={() => handleRemoveProduct(item) } > <RiDeleteBinLine /></p>
          <hr className='hr_incartdisplay' />
          </div>
     

      ))}

    

      </div>
      <div className='order_summary' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal:</p>
<small className='cart_totalitemsprice' >${totalPrice}</small>
<p>Shipping:</p>
<p>VAT:</p>

<Link to='/Checkout' ><button className='checkout_btn' >Go to Checkout</button></Link>
      </div>

     


        <NavigationBar  cartItems={cartItems}/>
    </div>
  )
}
