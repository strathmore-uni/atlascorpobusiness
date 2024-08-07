import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editproduct.css'; // Import the CSS file
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';
import Swal from 'sweetalert2';
import { useAuth } from '../MainOpeningpage/AuthContext';
const EditProduct = () => {
  const {currentUser} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    partnumber: '',
    Description: '',
    image: '',
    thumb1: '',
    thumb2: '',
    prices: [], // Initialize prices as an empty array
    mainCategory: '',
    subCategory: ''
  });
  const [categories, setCategories] = useState({
    mainCategories: [],
    subCategories: []
  });

 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, {
          params: { email: currentUser.email } // Pass the admin's email as a query parameter
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/mycategories`);
        setCategories({
          mainCategories: response.data.mainCategories || [],
          subCategories: response.data.subCategories || []
        });
        console.log('Categories fetched:', response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id,currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = product.prices.map((price, i) =>
      i === index ? { ...price, [field]: value } : price
    );
    setProduct(prevState => ({
      ...prevState,
      prices: updatedPrices
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser.email) {
      console.error('Current user email is undefined');
      alert('Failed to update product: User email is not available.');
      return;
    }
  
    try {
      const productWithEmail = { ...product, email: currentUser.email };
  
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, productWithEmail, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}` // Include the token if applicable
        }
      });
      alert('Product updated successfully');
      navigate('/productlist'); // Redirect after update
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };
  
  


  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`);
        Swal.fire(
          'Deleted!',
          'The product has been deleted.',
          'success'
        );
        navigate('/productlist'); // Redirect to products list
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire(
          'Error!',
          'Failed to delete product. Please ensure no related records exist.',
          'error'
        );
      }
    }
  };
  
  
  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Part Number:
          <input type="text" name="partnumber" value={product.partnumber} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="Description" value={product.Description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="image" value={product.image} onChange={handleChange} />
        </label>
        <br />
        <label>
          Thumbnail 1 URL:
          <input type="text" name="thumb1" value={product.thumb1} onChange={handleChange} />
        </label>
        <br />
        <label>
          Thumbnail 2 URL:
          <input type="text" name="thumb2" value={product.thumb2} onChange={handleChange} />
        </label>
        <br />
        <label>
          Main Category:
          <select name="mainCategory" value={product.mainCategory} onChange={handleCategoryChange}>
            <option value="">Select Main Category</option>
            {categories.mainCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Sub Category:
          <select name="subCategory" value={product.subCategory} onChange={handleCategoryChange}>
            <option value="">Select Sub Category</option>
            {product.mainCategory && categories.subCategories
              .filter(cat => cat.mainCategoryId === product.mainCategory)
              .map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
          </select>
        </label>
        <br />
        <div className="prices-section">
          <h3>Prices and Stock</h3>
          {product.prices && product.prices.map((price, index) => (
            <div key={index} className="price-item">
              <label>
                Country:
                <input
                  type="text"
                  value={price.country_code}
                  readOnly
                />
              </label>
              <br />
              <label>
                Price:
                <input
                  type="text"
                  value={price.price}
                  onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                />
              </label>
              <br />
              <label>
                Stock Quantity:
                <input
                  type="text"
                  value={price.stock_quantity || ''} // Display stock quantity from prices if exists
                  onChange={(e) => handlePriceChange(index, 'stock_quantity', e.target.value)}
                />
              </label>
              <br />
            </div>
          ))}
        </div>
        <button type="submit" className='editproduct_button'>Update Product</button>
        <button type="button" className='deleteproduct_button' onClick={handleDelete}>Delete Product</button>
      </form>
      <AdminCategory />
      <Adminnav />
    </div>
  );
};

export default EditProduct;
