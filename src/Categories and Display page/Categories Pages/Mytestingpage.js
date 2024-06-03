import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Mytestingpage() {


    const [data, setData] = useState([]);

    const location = useLocation();
  const products = location.state?.products || [];
  
  
    useEffect(() => {
      axios
        .get("http://localhost:3001/api/products")
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
  return (
    <div>
 <h1>Products</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              <h2>{product.partnumber}</h2>
              <p>{product.Description}</p>
              <p>Price: {product.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}

    </div>
  )
}
