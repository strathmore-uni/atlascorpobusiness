import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './users.css'; 
import AdminCategory from './AdminCategory';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({ mainCategories: [], subCategories: [] });
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); 
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/mycategories`);
        const categoriesData = response.data;

        if (categoriesData.mainCategories && categoriesData.subCategories) {
          setCategories({
            mainCategories: categoriesData.mainCategories,
            subCategories: categoriesData.subCategories,
          });
        } else {
          console.error('Categories response is not in expected format:', categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMainCategoryChange = (e) => {
    setSelectedMainCategory(e.target.value);
    setSelectedSubCategory(''); // Reset subcategory when main category changes
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  // Debug: Check categories and products
  console.log('Categories:', categories);
  console.log('Selected Main Category:', selectedMainCategory);
  console.log('Selected Sub Category:', selectedSubCategory);

  // Filter products based on search query, main category, and subcategory
  const filteredProducts = products.filter((product) => {
    const partnumber = product.partnumber || ''; // Default to empty string if null or undefined
    const description = product.Description || ''; // Default to empty string if null or undefined
    const matchesSearch = partnumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMainCategory = !selectedMainCategory || product.mainCategory === selectedMainCategory;
    const matchesSubCategory = !selectedSubCategory || product.subCategory === selectedSubCategory;

    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  // Filter subcategories based on the selected main category
  const filteredSubCategories = categories.subCategories.filter(subCat => 
    products.some(product => product.mainCategory === selectedMainCategory && product.subCategory === subCat)
  );

  return (
    <div className="products-container">
      <h2>Products List</h2>
  
      <input
        type="text"
        placeholder="Search by part number or description"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-orderlist"
      />

      <select value={selectedMainCategory} onChange={handleMainCategoryChange} className="category-select">
        <option value="">All Main Categories</option>
        {categories.mainCategories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {selectedMainCategory && (
        <select value={selectedSubCategory} onChange={handleSubCategoryChange} className="category-select">
          <option value="">All Sub Categories</option>
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory, index) => (
              <option key={index} value={subCategory}>
                {subCategory}
              </option>
            ))
          ) : (
            <option value="">No Subcategories Available</option>
          )}
        </select>
      )}

      {loading ? (
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      ) : (
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product.id}>
                <span>{product.partnumber || 'N/A'} - {product.Description || 'N/A'}</span>
                <Link to={`/editproduct/${product.id}`}>Edit</Link>
              </li>
            ))
          ) : (
            <li>No products found</li>
          )}
        </ul>
      )}
      <AdminCategory />
    </div>
  );
};

export default ProductsList;
