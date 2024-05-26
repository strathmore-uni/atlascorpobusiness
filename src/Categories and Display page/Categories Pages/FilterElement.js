import React, { useState } from 'react';
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
export default function   FilterElement({datas, fulldatas,handleAddProductDetails,cartItems,oilfree,toggleCategoriesAppear }) {
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState('grid');

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(fulldatas.length / itemsPerPage);


  const navigate = useNavigate();

  const handleProductClick = (product) => {
    handleAddProductDetails(product);
    navigate('/Productdetails', { state: { product } });
  };

  return (
    <div className='big_container' key={1}>
           <div className='shop_routes' >
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
     
   
     
<div className='productdisplay_container' key={1} >


 <div className={`sub_productdisplay_container ${layoutMode}`}>
 <small  className='featuredprdts_length' >Featured Products: {datas.length}</small>
      <div className='btn_group' >
      <small  >Sort by:</small>
      <p onClick={() => setLayoutMode('grid')} ><CiGrid41 /></p>
      <p  onClick={() => setLayoutMode('normal')} > <CiGrid2H /></p>
</div>

        { (typeof datas==="undefined") ?(
  <h1 className='p_loading' >Loading...</h1>
        ):(
  datas.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (
          <>
          <Link key={product.partnumber}  className='mylink' 
          // Moving to the product page
          to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}onClick={() => handleProductClick(product)} > 

            <img className=' prdt_image' src={product.image} alt='' />
            <p className='cameraoff_icon'  ><LuCameraOff /></p>
          <p className='prdt_partnumber'> {product.partnumber}</p>
          {/** */}
            <p  className='prdt_title'  >{product.Description}   </p>
            <p  className='prdt_category'  >{product.category}   </p>
            <p  className='prdt_price'  >USD {product.Price}   </p>
       </Link>
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
       </>

        )
      
      
        ))}
          

      </div>
      </div>
     

     
    
   <Categories fulldatas={fulldatas} oilfree={oilfree}  />
  
      <NavigationBar cartItems={cartItems} />
   <Footer  />

    </div>
  );
}