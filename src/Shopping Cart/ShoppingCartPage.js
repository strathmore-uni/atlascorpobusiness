import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './shoppingcartpage.css'
export default function ShoppingCartPage({cartItems,handleRemoveProduct,handleAddProduct,handleCartClearance}) {

  const totalPrice = cartItems.reduce(
    (price, item) => price + item.quantity * item.price,
    0
  );

  return (
    <div className='shoppingcartpage_container' >
      <div  className='productsdisplay_shoppingcart' >
 {cartItems.map((item) => (
        <div key={item.id} className='display_cart' >
          
        {cartItems.length === 0 && (
          <p className="cart_empty"> No items are added</p>
        )}

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
          
             <p> {item.title}</p>
             <p className='cart_itemprice' >USD{item.price}</p>
          
          </div>
     

      ))}
      <hr  className='hr_shoppingcartpage' />
        <p className='p_carttotal' >Total Price</p>
<small className='cart_totalitemsprice' >USD {totalPrice}</small>
      </div>
     


        <NavigationBar />
    </div>
  )
}
