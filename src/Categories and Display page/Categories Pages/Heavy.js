import React from 'react'
import Categories from '../Categories'
import NavigationBar from '../../General Components/NavigationBar'
import './big.css'



export default function Heavy({fulldatas}) {
  return (
    <div  className='big_container' >

   
        
        <Categories fulldatas={fulldatas} />
        <NavigationBar cartItems />
    </div>
  )
}
