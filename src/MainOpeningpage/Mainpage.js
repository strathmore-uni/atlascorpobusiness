import React from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './mainpage.css'
import { FaArrowRight } from "react-icons/fa";

import { Link } from 'react-router-dom';
import Footer from '../General Components/Footer';


export default function Mainpage({cartItems,datas,handleAddProductDetails}) {


  return (
    <div>
    

<div className='mainpage_container'> 


<div className='container_media' >

       
</div>



  <section>
<p className='main_p' ><b style={{fontSize:'3rem'}} >Atlas Copco Kenya</b> Home of Industrial ideas</p>
    
    <p className='submain_p' ><b style={{fontSize:'2rem'}} >Atlas Copco</b> is a world leading provider of industrial productivity solutions, serving customers in Kenya for  88 years.. </p>
  
  <p className='sub_p_sub'><p   >
    Why Us?
    </p>
    Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing and process industries, construction, automotives, electronics, oil and gas and much more.

Atlas Copco in Kenya handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electic, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.  </p>
  </section>

<img className='img_mainpage'  src="./public/R.png" alt='' />
 
 <Link to='/Shop' style={{color:'black'}} > <div className='shopwithus'>
  

   <img src='/images/fleetLink.jpg' alt='' className='imageshop_withus' />
  <h3>Shop more than 75.000 original Atlas Copco spare parts now!</h3>





</div></Link>

<div className='featuredproducts_mainpage' >
<Link to="/Shop" style={{textDecoration:'none'}}><h2>Popular Categories</h2> </Link>

<a  className='linktoviewmore'  href='/Shop' >View more<FaArrowRight  /></a>
<div  className='mainpage_products'>
  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Filter Elements</p>
  </div>


  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Serv Kits</p>
  </div>

  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Bearing Kits</p>
  </div>

  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Over Haul Kits</p>
  </div>

  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Over Haul Kits</p>
  </div>

  <div className='individual_categories'>
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Over Haul Kits</p>
  </div>




  </div>
</div>


</div>


<NavigationBar cartItems={cartItems}/>
<div className='mainpage_footer' >
         <Footer  />
      </div>
    </div>
  )
}
