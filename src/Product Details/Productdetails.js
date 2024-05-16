import React from "react";
import NavigationBar from "../General Components/NavigationBar";
import "./productdetails.css";
import { GrCart } from "react-icons/gr";
import { LuCameraOff } from "react-icons/lu";


export default function ProductDetails({
  productdetails,
  handleAddProduct,
  cartItems,
 
}){ 







  return (
    <div className="productdetails_container" key={1} >
      <div className="productview_container">
        {productdetails.map((product) => (
          <div className="product_details" key={product.id}>
      
            <div className="noimage_div" ><LuCameraOff  /></div>
            <div className="productdetails_routes">
              <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
                {" "}
                Home &nbsp;/
              </a>
              <a
                href="/Shop"
                style={{ color: "#0078a1", textDecoration: "none" }}
              >
                &nbsp;Shop &nbsp;/
              </a>
              <a
                href="/Shop/Filterelement"
                style={{ color: "#0078a1", textDecoration: "none" }}
              >
                &nbsp;Filter &nbsp;/
              </a>
              <p style={{ position: "absolute", left: "11rem", top: "-1rem" }}>
                {product.Description}
              </p>
            </div>
            <div className="pdrtdetails_card">
            <p className="productdetails_price" > USD {product.Price}  </p>
                          <h2 className="productdetails_title">{product.Description}</h2>
         
           <p className="productdetails_partnumber" >Part Number: {product.partnumber}</p>
           <button className="addtocart_btn"    onClick={() => handleAddProduct(product)}><GrCart /> Add to cart</button>
              </div>

  {/**        
   *    <h2 className="producttitleabout"> About {product.title}</h2>
            <p className="productdetails_about">{product.about}</p> 
            <h3>
              <strong>Choose the right model to suit your needs:</strong>
            </h3>
 
            <div className="about_specifications">
              {product.features.map((spec) => (
                <p key={spec.name}>
                  {" "}
                  <strong>
                    <p>{spec.name}</p>
                  </strong>
                  <li>{spec.description}</li>
                </p>
              ))}
              <strong>
                <p
                  style={{
                    position: "relative",
                    left: "0rem",
                    fontSize: "1.2rem",
                    color: "#0078a1",
                  }}
                >
                  Added Features
                </p>
              </strong>
              {product.addedFeatures.map((about) => (
                <p key={about.name}>
                  <li>{about.name}</li>
                </p>
              ))}
            </div>

            <div className="productdetails_benefits">
              <h2>Technical Benefits</h2>
              {product.benefits.map((benefit) => (
                <p key={benefit.name}>
                  <strong>{benefit.name}</strong> <li>{benefit.value}</li>
                </p>
              ))}
            </div>
            <div className="productdetails_specifications">
              <h2>Technical Specifications</h2>
              <table>
                <thead>
                  <tr>
                    <th>Technical Property</th>
                    <th style={{ position: "absolute", left: "20rem" }}>
                      {" "}
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody style={{ position: "absolute" }}>
                  {product.technical_specifications.map((spec) => (
                    <tr key={spec.name}>
                      <td>
                        <strong>{spec.name}</strong>
                      </td>
                      <td style={{ position: "absolute", left: "20rem" }}>
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prdtdetails_related products">
              



            </div>*/}
         
       
          </div>
          
        ))}
        
      </div>
      <NavigationBar cartItems={cartItems} />
    </div>
  );
}
