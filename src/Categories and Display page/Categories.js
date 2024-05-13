import React from 'react'
import "./categories.css"
import { Link } from 'react-router-dom'

export default function Categories() {
  return (
    <div className='Categories_container'>

            <div  className='listedproducts_categories' >
                    <Link to='/Shop/Big' style={{ textDecoration: "none", color: "black" }}> <li>Compressors</li></Link> 
                    <Link to='/Shop/Heavy' style={{ textDecoration: "none", color: "black" }}> <li>Heavy</li></Link>  <li>BIG</li>
                   <li>HEAVY</li>
                   <li>BIG</li>
                   <li>HEAVY</li>
                


                   </div>

    </div>
  )
}
