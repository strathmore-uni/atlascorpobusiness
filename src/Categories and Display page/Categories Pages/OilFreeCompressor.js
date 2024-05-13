import React,{useState} from 'react'
import ReactPaginate from 'react-paginate';
import NavigationBar from '../../General Components/NavigationBar';
import Categories from '../Categories';
import { Link } from 'react-router-dom';

export default function OilFreeCompressor({ oilfreedata,handleAddProductDetails,cartItems,fulldatas }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [layoutMode, setLayoutMode] = useState('grid');
  
    const itemsPerPage = 12;
    const pagesVisited = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(fulldatas.length / itemsPerPage);


  
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
       <a href='/Shop/Big'
         style={{ color: "#0078a1", textDecoration: "none"}}
      
       >
         &nbsp;Big &nbsp;/
       </a>
       <p
         style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "10rem", top: "-1rem", width:'10rem' }}
      
       >
         &nbsp;Oil Free Compressors &nbsp;
       </p>
 </div>


<div className='productdisplay_container' >

<div className={`sub_productdisplay_container ${layoutMode}`}>
<div className='btn_group' >
<button   onClick={() => setLayoutMode('grid')}>Grid</button>
<button onClick={() => setLayoutMode('normal')}>Normal</button>
</div>

 {oilfreedata.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (
   
   <Link key={product.id} style={{textDecoration:'none',color:'black'}}
   // Moving to the product page
   to={`/Productdetails?name=${product.title}?id=${product.id}`} onClick={() => handleAddProductDetails(product)} > 
   <div key={index} className="single_product">

     <p style={{fontSize:'1.4rem'}} >{product.title}   </p>
   </div></Link>
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



<Categories fulldatas={fulldatas}  />

<NavigationBar cartItems={cartItems} />


</div>
  )
}
