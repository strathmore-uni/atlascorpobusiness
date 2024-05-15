import React,{useState} from 'react'
import "./Navigation.css";

export default function CategoriesHovered() {
    const [categoriesappear, categoriessetAppear] = useState();
    

  
    const toggleCategoriesAppear = () => {
      categoriessetAppear(!categoriesappear);
    };
  
  
     
  

  return (
    

<div
        className="products_li"
        onMouseEnter={toggleCategoriesAppear}
        onMouseLeave={toggleCategoriesAppear}
      >
         <small className="p_product">Filters</small>{" "}
    
         
      
      
      
        
      </div>

  )
}
