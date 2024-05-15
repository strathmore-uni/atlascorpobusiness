import React,{useState} from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './checkout.css'

export default function Checkout({totalPrice}) {

    const [selectedCity, setSelectedCity] = useState('');

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        
      
      };
  return (
    <div className='checkout_container'>
        
<h4>Checkout</h4>
        <div className='' >
        <div className='order_summary' >
        <p>Order Summary</p>
        <p className='p_carttotal' >Subtotal</p>
<small className='cart_totalitemsprice' >${totalPrice}</small>

<button className='checkout_btn' >Go to Checkout</button>
      </div>
            <form>
<label for='company_name'>Company Name </label>
<input type='text' placeholder='Company Name' id='company_name'  className='inputs'  />

<label  for='title'>Title</label>
<input type=''  />
<select id="city" value={selectedCity} onChange={handleCityChange} className='options'  >
    <option value="">Select City</option>
    <option value="Nairobi">Nairobi</option>
    <option value="Nakuru">Nakuru</option>
  </select>

            </form>


        </div>


<NavigationBar   />
    </div>
  )
}
