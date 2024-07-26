import React from 'react'
import { LuCameraOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import "../Shopping Cart/shoppingcartpage.css";
import { GrCart } from "react-icons/gr";
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
export default function Saveditems({quotationItems,handleRemoveSingleQuotationProduct,handleAddProduct}) {
  return (
    <div>
    <div className="quotation_items" >
          <Link to='/shop' className='backtoform'>
          <p><IoIosArrowBack className='arrowbackReview' />Back</p>
        </Link>
<h2>Saved Items</h2>

{quotationItems.length === 0 && (
          <p className="cart_empty"> No items are added</p>
        )}
{quotationItems.length > 0 && (
          <div >
            
            {quotationItems.map((item) => (
              <div key={item.partnumber} className="display_cart">
               {item.image ? (
                        <img
                          className="prdt_image_shopping"
                          src={item.image}
                          alt=""
                        />
                      ) : (
                        <p className="cameraoff_icon">
                          <LuCameraOff />
                        </p>
                      )}

                
                <p className="p_serialnumber">
                  Part Number:&nbsp;{item.partnumber}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    position: "absolute",
                    left: "4rem",
                  }}
                >
                  {" "}
                  {item.Description}
                </p>
                
                <p className="cart_itemprice">$ {item.Price}</p>
                <div className="stock_status_saved">
                        <div
                          className={`status_indicator_saved ${
                            item.quantity > 0 ? "in_stock" : "out_of_stock"
                          }`}
                        ></div>
                        <div className="in_out_stock">
                          {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                        {item.quantity <= 0 && (
                          <div className="get_quote_productpage">
                            <p>Get a Quote</p>
                          </div>
                        )}
                      </div>
                
                <button className="addtocart_btn_saveditem" onClick={() => handleAddProduct(item)}>
                <GrCart /> Add to cart
              </button>
              <p
              className="cart_removeitem"
              onClick={() => handleRemoveSingleQuotationProduct(item)}
            >
              Remove
              {" "}
              <RiDeleteBinLine />
            </p>
                <hr className="hr_incartdisplay" />
              </div>
              
            ))}
          </div>
        )}
    </div>
    <NavigationBar />
    </div>

  )
}
