import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './productdetails.css'

export default function Productdetails({handleAddProductDetails,  productdetails}) {
  return (
    <div className='productdetails_container' >
      <div className='productview_container' >
{productdetails.map((products) => (
  <div className='' >

<img  src={products.image} alt='' />
<p>{products.title}   </p>

  </div>


  
) )}
</div>
<NavigationBar />
    </div>
  )
}
