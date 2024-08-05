import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
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
    },
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const parsedProducts = jsonData.slice(1).map((row) => ({
        partnumber: row[0] || '',
        description: row[1] || '',
        image: row[2] || '',
        thumb1: row[3] || '',
        thumb2: row[4] || '',
        prices: [{ country_code: row[5] || '', price: row[6] || '' }],
        stock: row[7] || 0,
        mainCategory: row[8] || '',
        subCategory: row[9] || '',
      }));

      setProducts(parsedProducts);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="form-container-addproduct">
      <h2>Add New Products</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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
            <button type="button" onClick={() => addPriceField(productIndex)}>
              Add Price
            </button>
          </div>
        ))}
        <button type="button" onClick={addProduct}>Add Product</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;
