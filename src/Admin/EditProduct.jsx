import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editproduct.css'; // Import the CSS file
import AdminCategory from './AdminCategory';
import Swal from 'sweetalert2';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    partnumber: '',
    Description: '', // This will be updated to handle multiple descriptions
    image: '',
    thumb1: '',
    thumb2: '',
    prices: [],
    mainCategory: '',
    subCategory: '',
    specifications: [],
    detailedDescription: '',
    descriptions: [] // Array to handle multiple descriptions
  });

  const [categories, setCategories] = useState({
    mainCategories: [],
    subCategories: []
  });
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, {
          params: { email: currentUser.email }
        });
        setProduct(response.data || {}); // Ensure response.data is assigned correctly
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
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchProduct();
    fetchCategories();
  }, [id, currentUser]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDescriptionChange = (index, value) => {
    setProduct(prevState => {
      const descriptions = Array.isArray(prevState.descriptions) ? [...prevState.descriptions] : [];
      descriptions[index] = value;
      return { ...prevState, descriptions };
    });
  };
  
  const handleRemoveDescription = (index) => {
    setProduct(prevState => {
      const descriptions = Array.isArray(prevState.descriptions) ? [...prevState.descriptions] : [];
      descriptions.splice(index, 1);
      return { ...prevState, descriptions };
    });
  };
  
  const handleAddDescription = () => {
    setProduct(prevState => {
      const descriptions = Array.isArray(prevState.descriptions) ? [...prevState.descriptions] : [];
      return { ...prevState, descriptions: [...descriptions, ''] };
    });
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

  const handleAddSpecification = () => {
    setProduct(prevState => ({
      ...prevState,
      specifications: [...(prevState.specifications || []), { spec_key: '', spec_value: '' }]
    }));
  };

  const handleRemoveSpecification = (index) => {
    setProduct(prevState => ({
      ...prevState,
      specifications: (prevState.specifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (index, key, value) => {
    setProduct(prevState => {
      const updatedSpecifications = [...(prevState.specifications || [])];
      updatedSpecifications[index] = { ...updatedSpecifications[index], [key]: value };
      return { ...prevState, specifications: updatedSpecifications };
    });
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
      toast.error('Failed to update product: User email is not available.');
      return;
    }

    try {
      const productWithEmail = { ...product, email: currentUser.email };

      await axios.put(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, productWithEmail, {
        headers: {
          'User-Email': currentUser.email,
        },
      });

      toast.success('Product updated successfully');
      navigate('/productlist');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product, you do not have the required permissions');
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
        await axios.delete(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          data: {
            email: currentUser.email
          }
        });
        toast.success('Product deleted successfully');
        navigate('/productlist');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product. Please ensure no related records exist.');
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
            {categories.subCategories
              .filter(cat => cat.mainCategoryId === product.mainCategory)
              .map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
          </select>
        </label>
        <br />
        <div className="prices-section">
          <h3>Prices and Stock</h3>
          {product.prices.map((price, index) => (
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
                  value={price.stock_quantity || ''}
                  onChange={(e) => handlePriceChange(index, 'stock_quantity', e.target.value)}
                />
              </label>
              <br />
            </div>
          ))}
        </div>
        <div className="descriptions-section">
  <h3>Descriptions</h3>
  {product.descriptions && product.descriptions.length > 0 ? (
    product.descriptions.map((desc, index) => (
      <div key={index} className="description-item">
        <label>
          Description {index + 1}:
          <input
            type="text"
            value={desc}
            onChange={(e) => handleDescriptionChange(index, e.target.value)}
          />
        </label>
        <button type="button" onClick={() => handleRemoveDescription(index)}>
          Remove
        </button>
      </div>
    ))
  ) : (
    <p>No descriptions available</p>
  )}
  <button type="button" onClick={handleAddDescription}>
    Add Description
  </button>
</div>

        <div className="specifications-section">
          <h3>Specifications</h3>
          {product.specifications.map((spec, index) => (
            <div key={index} className="specification-item">
              <label>
                Key:
                <input
                  type="text"
                  value={spec.spec_key}
                  onChange={(e) => handleSpecificationChange(index, 'spec_key', e.target.value)}
                />
              </label>
              <br />
              <label>
                Value:
                <input
                  type="text"
                  value={spec.spec_value}
                  onChange={(e) => handleSpecificationChange(index, 'spec_value', e.target.value)}
                />
              </label>
              <button type="button" onClick={() => handleRemoveSpecification(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSpecification}>
            Add Specification
          </button>
        </div>
        <br />
        <button type="submit"  className='editproduct_button' >Update Product</button>
        <button type="button" className='deleteproduct_button' onClick={handleDelete}>Delete Product</button>
      </form>
      <ToastContainer />
      <AdminCategory />
    </div>
  );
};

export default EditProduct;
