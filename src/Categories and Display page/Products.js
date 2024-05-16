import React, {useState}from "react";
import "./products.css";
import './Categories Pages/filterelement.css'

import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";

export default function Products({ fulldatas,datas,handleAddProductDetails }) {

  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState('grid');

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(fulldatas.length / itemsPerPage);
  return (
    <div className="products_container">
      
    
      <div className='productdisplay_container' >

<div className={`sub_productdisplay_container ${layoutMode}`}>
     <div className='btn_group' >
     <button   onClick={() => setLayoutMode('grid')}>Grid</button>
     <button onClick={() => setLayoutMode('normal')}>Normal</button>
</div>

       {datas.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (
         
         <Link  key={product.partnumber}  className='mylink' 
         // Moving to the product page
         to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`} onClick={() => handleAddProductDetails(product)} > 
        
           <p className='cameraoff_icon'  ><LuCameraOff /></p>
         <p className='prdt_partnumber'> {product.partnumber}</p>
         {/** */}
           <p  className='prdt_title'  >{product.Description}   </p>
           <p  className='prdt_category'  >{product.category}   </p>
           <p  className='prdt_price'  >USD {product.Price}   </p>
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
     </div>
    
    
  );
}
