import React, { useState } from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";


export default function Categories({ fulldatas}) {
  const [compressorDropdown, setCompressorDropdown] = useState(false);
  const [data] = useState([]);
  const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState(""); 

    const fetchProducts = async () => {
      try {
          const response = await axios.get('/api/products', {
              params: {
                  priceRange // Pass the selected price range as a parameter
              }
          });
          setProducts(response.data);
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  };

 

  return (
    <div className="Categories_container">
      <h3>Categories</h3>
      <div className="listedproducts_categories">
 {data}
          <li onClick={() => setCompressorDropdown(!compressorDropdown)}>
            Filter Element{" "}
            {compressorDropdown ? (
              <IoIosArrowUp  />
            ) : (
              <IoIosArrowDown  />
            )}{" "}
          </li>
        {compressorDropdown && (
          <ul className="compressor_dropdown">
           <Link to='/Shop/Filterelement' >  <li style={{width:'13.5rem',padding:'.5rem',color:''}} >Filter Element</li></Link> 
            <Link to='/Shop/Oilfreecompressor'  >
              <li  style={{width:'14rem',padding:'.5rem'}} >Oil-free compressors</li> </Link>
            <li  style={{width:'14rem',padding:'.5rem'}}>Piston Compressors</li>
          </ul>
        )}
        <Link
          to="/Shop/Oilfreecompressor"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Serv Kit</li>
        </Link>{" "}
        <li>BIG</li>
        <li>HEAVY</li>
        <li>BIG</li>
        <li>HEAVY</li>
      </div>
      
      
      <div  className="price_range_container" >
        <h3>Price Range</h3>
        <div onClick={() => setPriceRange("0-100")}>0-100</div>
                <div onClick={() => setPriceRange("100-200")}>100-200</div>

                <button onClick={fetchProducts}>Search</button>
      </div>
      <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
    </div>
  );
}