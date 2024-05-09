import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './productdetails.css'

export default function Productdetails({handleAddProductDetails,  productdetails}) {
 


  return (
    <div className='productdetails_container' >
      <div className='productview_container' >
{productdetails.map((product) => (
  <div className='' >

<img  className='productdetails_image'  src={product.image} alt='' />
<p>{product.title}   </p>

  </div>


  
) )}
<h1>Waweru</h1>
</div>
<NavigationBar />
    </div>
  )
}
