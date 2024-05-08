import React from 'react'
import Categories from '../Categories'
import NavigationBar from '../../General Components/NavigationBar'
import './big.css'
import Pagination from '../../General Components/Pagination'
import Footer from '../../General Components/Footer'

export default function Heavy() {
  return (
    <div  className='big_container' >

   
    <Footer />
        <Pagination />
        <Categories />
        <NavigationBar />
    </div>
  )
}
