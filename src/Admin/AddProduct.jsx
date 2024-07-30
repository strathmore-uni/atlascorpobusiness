import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminproducts.css'; // Import the CSS file
import AdminCategory from './AdminCategory';

const AddProduct = () => {
  const [products, setProducts] = useState([
    {
      partnumber: '',
      description: '',
      image: '',
      thumb1: '',
      thumb2: '',
      prices: [{ country_code: '', price: '' }],
      stock: 0,
      mainCategory: '',
      subCategory: '',
    }
  ]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/categories`);
        setCategories(response.data.categories);
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handlePriceChange = (productIndex, priceIndex, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, pIdx) =>
      pIdx === productIndex
        ? {
            ...product,
            prices: product.prices.map((price, prIdx) =>
              prIdx === priceIndex ? { ...price, [name]: value } : price
            ),
          }
        : product
    );
    setProducts(updatedProducts);
  };

  const addPriceField = (index) => {
    const updatedProducts = products.map((product, i) =>
      i === index
        ? { ...product, prices: [...product.prices, { country_code: '', price: '' }] }
        : product
    );
    setProducts(updatedProducts);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts/batch`, products);
      alert('Products added successfully');
    } catch (error) {
      console.error('Error adding products:', error);
      alert('Error adding products');
    }
  };
  

  const handleAddCategory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/categories`, { category: newCategory });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/categories`, { subcategory: newSubcategory });
      setSubcategories((prevSubcategories) => [...prevSubcategories, newSubcategory]);
      setNewSubcategory('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        partnumber: '',
        description: '',
        image: '',
        thumb1: '',
        thumb2: '',
        prices: [{ country_code: '', price: '' }],
        stock: 0,
        mainCategory: '',
        subCategory: '',
      },
    ]);
  };

  return (
    <div className="form-container-addproduct">
      <h2>Add New Products</h2>
      <form onSubmit={handleSubmit}>
        {products.map((product, productIndex) => (
          <div key={productIndex} className="product-form-section">
            <h3>Product {productIndex + 1}</h3>
            <input
              type="text"
              name="partnumber"
              placeholder="Part Number"
              value={product.partnumber}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={product.image}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />
            <input
              type="text"
              name="thumb1"
              placeholder="Thumbnail 1 URL"
              value={product.thumb1}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />
            <input
              type="text"
              name="thumb2"
              placeholder="Thumbnail 2 URL"
              value={product.thumb2}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            />

            <select
              name="mainCategory"
              value={product.mainCategory}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            >
              <option value="">Select Main Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Main Category"
            />
            <button
              type="button"
              className="add-category-button"
              onClick={handleAddCategory}
            >
              Add Category
            </button>

            <select
              name="subCategory"
              value={product.subCategory}
              onChange={(e) => handleProductChange(productIndex, e)}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcat, index) => (
                <option key={index} value={subcat}>{subcat}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              placeholder="New Subcategory"
            />
            <button
              type="button"
              className="add-subcategory-button"
              onClick={handleAddSubcategory}
            >
              Add Subcategory
            </button>

            {product.prices.map((price, priceIndex) => (
              <div key={priceIndex} className="price-field">
                <input
                  type="text"
                  name="country_code"
                  placeholder="Country Code"
                  value={price.country_code}
                  onChange={(e) => handlePriceChange(productIndex, priceIndex, e)}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={price.price}
                  onChange={(e) => handlePriceChange(productIndex, priceIndex, e)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="add-price-button"
              onClick={() => addPriceField(productIndex)}
            >
              Add Price
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-product-button"
          onClick={addProduct}
        >
          Add Another Product
        </button>
        <button type="submit" className="submit-button">
          Add Products
        </button>
      </form>
      <AdminCategory />
    </div>
  );
};

export default AddProduct;
