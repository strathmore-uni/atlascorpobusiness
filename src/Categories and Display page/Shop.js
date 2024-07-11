import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import Categories from './Categories'
import Products from './Products'

import './shop.css'
import Footer from '../General Components/Footer'



export default function Shop( {handleAddProductDetails,fulldatas,cartItems,datas,handleAddQuotationProduct} ) {

  return (
    <div>
    <div className='container_shop' >
    
           <div className='shop_routes' >
 <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
                {" "}
                Home &nbsp;/
              </a>
              <p
                style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "3rem", top: "-.8rem" }}
             
              >
                &nbsp;Shop &nbsp;
              </p>
        </div>
     
      <div className='shop_product_container' >
   
             
<Products datas={datas} handleAddProductDetails={handleAddProductDetails} handleAddQuotationProduct={handleAddQuotationProduct} fulldatas={fulldatas} />
      </div>
    
           
    </div>
 
        <Categories /> 
        
        <NavigationBar   cartItems={cartItems}/>
        <div className='shop_footer' >
         <Footer  />
      </div>

    </div>
  )
}
