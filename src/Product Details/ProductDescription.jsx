import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDescription = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError('Error fetching product details');
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">

      <p>{product.description}</p> {/* Display fetched description */}
    </div>
  );
};

export default ProductDescription;
