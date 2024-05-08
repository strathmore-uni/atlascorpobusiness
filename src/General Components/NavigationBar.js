import React, { useState,useEffect } from 'react'
import "./Navigation.css"
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

export default function NavigationBar() {

    const [categoriesappear,categoriessetAppear] = useState() ;
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleCategoriesAppear = () => {
        categoriessetAppear(!categoriesappear);
      };

      
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div
    className={`container_NavigationBar ${isScrolled ? 'scrolled' : ''}`}
  >
      <Link to='/'><img  src='./logo2.0.jpg' alt='Atlas Copco' className='logo'  /></Link>
      
            
                <div className='products_li' onMouseEnter={toggleCategoriesAppear} onMouseLeave={toggleCategoriesAppear}   >
                  <Link to='./Shop' ><p className='' style={{textDecoration:'none',color:'black'}} >Products</p> </Link>  
                <IoIosArrowDown  className='arrow_down_li' />
                {categoriesappear && (
                    <div  className='listedproducts' >
                    <li>BIG</li>
                   <li>HEAVY</li>
                   <li>BIG</li>
                   <li>HEAVY</li>
                   <li>BIG</li>
                   <li>HEAVY</li>
                    
</div>
                )}

                
                
              </div>
              <p className='p_navigation_contacts' >Contact Us</p>

              < IoSearchOutline className='search_icon_navigation' />
     


      
    </div>
  )
}
