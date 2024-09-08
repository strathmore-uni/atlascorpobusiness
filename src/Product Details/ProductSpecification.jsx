import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductSpecification = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/spec/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
     
      <ul>
        {product.specifications.map((spec, index) => (
          <li key={index}>
            <strong>{spec.spec_key}:</strong> {spec.spec_value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecification;
