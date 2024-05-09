import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import Categories from './Categories'
import Products from './Products'

import './shop.css'



export default function Shop( {fulldatas} ) {

  return (
    <div>
    <div className='container_shop' >
      
    
           <Products fulldatas={fulldatas} />
    </div>

        <Categories />
        <NavigationBar  />
  
    </div>
  )
}
