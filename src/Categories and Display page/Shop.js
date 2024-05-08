import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import Categories from './Categories'
import Products from './Products'

export default function Shop() {
  return (
    <div>
        <Products />
        <Categories />
        <NavigationBar  />
    </div>
  )
}
