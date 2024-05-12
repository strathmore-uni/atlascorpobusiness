import React from 'react';
import NavigationBar from '../General Components/NavigationBar';
import './productdetails.css';

export default function ProductDetails({ productdetails,handleAddProduct,cartItems }) {
  return (
    <div className="productdetails_container">
      <div className="productview_container">
      
    
      
        {productdetails.map((product) => (
          
          <div className="product_details" key={product.id}>
              <div className='productdetails_routes' >
            <a href='/' style={{color:'#0078a1',textDecoration:'none'}} > Home &nbsp;/</a>
            <a href='/Shop' style={{color:'#0078a1',textDecoration:'none'}} >&nbsp;Shop &nbsp;/</a>
            <a href='/Shop/Big' style={{color:'#0078a1',textDecoration:'none'}} >&nbsp;Big &nbsp;/</a>
            <p style={{position:'absolute',left:'10rem',top:"-1rem" } } >{product.title}</p>
        
                </div>
            <h2 className="productdetails_title">{product.title}</h2>
            <h2  className='producttitleabout' > About  {product.title}</h2>
            <p className="productdetails_about">{product.about}</p>
            <h3><strong>Choose the right model to suit your needs:</strong></h3>
           
           <div className='about_specifications' >
           {product.features.map((spec) => (
              <p key={spec.name}> <strong><p >{spec.name}</p></strong><li>{spec.description}</li></p>
            ))}
            <strong><p style={{position:'relative',left:'0rem',fontSize:'1.2rem'}} >Added Features</p></strong>
            {product.addedFeatures.map((about) => (
              <p key={about.name}><li>{about.name}</li></p>

             
            ) )}
        
             
          
            </div>
           
            <div className='productdetails_benefits'>
            <h2>Technical Benefits</h2>
            {product.benefits.map((benefit) => (
              <p key={benefit.name}>{benefit.name}  <li>{benefit.value}</li></p>

             
            ) )}
              </div>
           
              <button className='btn_addtocart'   onClick={() => handleAddProduct(product)} >Add to cart</button>
          </div>
          
        ))}
       
      </div>
      <NavigationBar cartItems={cartItems} />
    </div>
  );
}