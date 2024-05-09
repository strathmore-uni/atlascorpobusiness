import React from 'react'
import Categories from '../Categories'
import NavigationBar from '../../General Components/NavigationBar'
import './big.css'
import Pagination from '../../General Components/Pagination'


export default function Heavy() {
  return (
    <div  className='big_container' >

   
        <Pagination />
        <Categories />
        <NavigationBar />
    </div>
  )
}
