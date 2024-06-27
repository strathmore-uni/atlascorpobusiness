import React, { useEffect } from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './mainpage.css'
import { FaArrowRight } from "react-icons/fa";

import { Link, useNavigate } from 'react-router-dom';
import Footer from '../General Components/Footer';
import { useAuth } from './AuthContext';


export default function Mainpage({cartItems,datas,handleAddProductDetails}) {
  const userEmail = localStorage.getItem('userEmail');
  const { IsAuthenticated } = useAuth();

  useEffect(() => {
    console.log(`IsAuthenticated: ${IsAuthenticated}`);
  }, [IsAuthenticated]);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
 
    navigate(`/products/${category}`);
  };

  const handleContinueToShop = () => {
    if (!IsAuthenticated) {
      navigate('/signin', { state: { redirectTo: '/shop' } }); // Redirect to sign-in page with redirect state
    } else {
      navigate('/shop'); // Navigate to shop page if authenticated
    }
  };

  return (
    <div>
    

<div className='mainpage_container'> 


<div className='container_media' >

<div className='overlay'></div>
</div>



  <section>
<p className='main_p' >Atlas Copco Kenya </p>
<p className='main_sub_P' >Home of Industrial ideas </p>
    
    <p className='submain_p' >Atlas Copco is a world leading provider of industrial productivity solutions, serving customers in Kenya for  88 years.. </p>
  
  <p className='sub_p_sub'><p   >
    Why Us?
    </p>
    Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing and process industries, construction, automotives, electronics, oil and gas and much more.

Atlas Copco in Kenya handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electic, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.  </p>
  </section>

<img className='img_mainpage'  src="./public/R.png" alt='' />
 
 <Link style={{color:'black'}} > <div className='shopwithus'>
  

   <img src='/images/fleetLink.jpg' alt='' className='imageshop_withus' />
  <h3>Shop more than 75.000 original Atlas Copco spare parts now!</h3>





</div></Link>

<div className='featuredproducts_mainpage' >
<Link to="#" onClick={handleContinueToShop} style={{textDecoration:'none'}}><h2>Popular Categories</h2> </Link>
<button onClick={handleContinueToShop}>Continue to Shop</button>

<Link  className='linktoviewmore'  to="#" onClick={handleContinueToShop} >Continue to Shop<FaArrowRight  /></Link>
<div  className='mainpage_products'>
  <div className='individual_categories'  onClick={() => handleCategoryClick('Filterelement')}  >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Filter Elements</p>
  </div>


  <div className='individual_categories'  onClick={() => handleCategoryClick('Servkit')}  >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Serv Kits</p>
  </div>

  <div className='individual_categories' onClick={() => handleCategoryClick('Bearingkits')} >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Bearing Kits</p>
  </div>

  <div className='individual_categories' onClick={() => handleCategoryClick('Overhaulkit')} >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Over Haul Kits</p>
  </div>

  <div className='individual_categories' onClick={() => handleCategoryClick('Oilfilterelement')} >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Oil filterelement</p>
  </div>

  <div className='individual_categories'  onClick={() => handleCategoryClick('Autodrainvalve')} >
    <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images'  />
    <p>Autodrain valve</p>
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
