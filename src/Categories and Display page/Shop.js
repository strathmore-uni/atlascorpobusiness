import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import Categories from './Categories'
import Products from './Products'

import './shop.css'



export default function Shop( {fulldatas,cartItems} ) {

  return (
    <div>
    <div className='container_shop' >
      
      <div className='shop_product_container' >
        
<Products fulldatas={fulldatas} />
      </div>
    
           
    </div>

        <Categories /> 
        <NavigationBar   cartItems={cartItems}/>
  
    </div>
  )
}
