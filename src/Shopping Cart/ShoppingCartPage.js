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
        <h2 style={{ color: '#0078a1'}} >Cart Items</h2>
        <hr  className='hr_shoppingcartpage' />
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
          <p>{item.id}</p>
             <p style={{fontWeight:'bold'}}> {item.title}</p>
             <p className='cart_itemprice' >USD{item.price}</p>
          <hr className='hr_incartdisplay' />
          </div>
     

      ))}

        <p className='p_carttotal' >Total Price</p>
<small className='cart_totalitemsprice' >USD {totalPrice}</small>
      </div>
     


        <NavigationBar  cartItems={cartItems}/>
    </div>
  )
}
