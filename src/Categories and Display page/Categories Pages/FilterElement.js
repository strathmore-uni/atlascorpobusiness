import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import NavigationBar from '../../General Components/NavigationBar';
import Categories from '../Categories';
import './filterelement.css';
import { Link } from 'react-router-dom';
import { LuCameraOff } from "react-icons/lu";
import Footer from '../../General Components/Footer';
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

export default function FilterElement({ datas, fulldatas, handleAddProductDetails, cartItems, oilfree, toggleCategoriesAppear }) {
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState('grid');
 

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(fulldatas.length / itemsPerPage);

  const navigate = useNavigate();


 
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className='big_container' key={1}>
      <div className='shop_routes' key={2}>
        <a href="./" style={{ color: "#0078a1", textDecoration: "none" }}>
          {" "}
          Home &nbsp;/
        </a>
        <a
          href='/Shop'
          style={{ color: "#0078a1", textDecoration: "none" }}
        >
          &nbsp;Shop &nbsp;/
        </a>
        <p
          style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "7rem", top: "-1rem" }}
        >
          &nbsp;Filter&nbsp;
        </p>
      </div>

      <div className='productdisplay_container'>
        <div className={`sub_productdisplay_container ${layoutMode}`}>
          <small className='featuredprdts_length'>
            {isLoading ? 'Loading...' : `Featured Products: ${datas.length}`}
          </small>
          <div className='btn_group'>
            <small>Sort by:</small>
            <p onClick={() => setLayoutMode('grid')}><CiGrid41 /></p>
            <p onClick={() => setLayoutMode('normal')} > <CiGrid2H /></p>
          </div>


 
           {datas.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (  
             
              <Link key={product.partnumber} className='mylink' 
                to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`} onClick={() => handleAddProductDetails(product)} >
                  
                <div key={product.partnumber}>
                {isLoading ? (
        <div className="loader">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      ) : (
                
        <>
        <img className='prdt_image' src={product.image} alt='' />
        <p className='cameraoff_icon'><LuCameraOff /></p>
        <p className='prdt_partnumber'>{product.partnumber}</p>
        <p className='prdt_title'>{product.Description}</p>
        <p className="prdt_price">${product.Price}</p>
      </>
       
       
       
       )}
                </div>
              </Link> 
            ))}
        
        
        
        
        
        
       
       
       
       




       
       <ReactPaginate
         previousLabel={'Previous'}
         nextLabel={'Next'}
         pageCount={pageCount}
         onPageChange={(e) => setPageNumber(e.selected)}
         containerClassName={'pagination'}
         previousLinkClassName={'pagination__link'}
         nextLinkClassName={'pagination__link'}
         disabledClassName={'pagination__link--disabled'}
         activeClassName={'pagination__link--active'}
       />
       </div>

        
      
      
      
          

      </div>
         

     
    
   <Categories fulldatas={fulldatas} oilfree={oilfree}  />
  
      <NavigationBar cartItems={cartItems} />

    
      <div className='filterelement_footer' >
         <Footer  />
      </div>

    </div>
  );
}