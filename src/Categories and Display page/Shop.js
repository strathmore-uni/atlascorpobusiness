import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import Categories from './Categories'
import Products from './Products'

import './shop.css'
import Footer from '../General Components/Footer'


export default function Shop() {
  return (
    <div>
    <div className='container_shop' >
      
      
        
       
    </div>
    <Products />
        <Categories />
        <NavigationBar  />
    <Footer />
    </div>
  )
}
