import React,{useState} from 'react'


export default function Form() {
   

    const [selectedCity, setSelectedCity] = useState('');

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        
      
      };
  return (
    <div>

<form>
<label for='company_name'>Company Name </label>
<input type='text' placeholder='Company Name' id='company_name'  className='inputs'  />

<label  for='title' className='title' >Title</label>

<select id="title" value={selectedCity} onChange={handleCityChange} className='input_title'  >
    <option value="">Title</option>
    <option value="Mr">Mr</option>
    <option value="Mrs">Mrs</option>
  </select>

  <label  for='fname' className='fname' >First Name</label>
  <input  id='fname' className='fnameinput' placeholder='First Name'   /> 

  <label  for='sname' className='sname' >Second Name</label>
  <input  id='sname' className='snameinput' placeholder='Second Name'   /> 

  <label  for='firstaddress' className='streetaddresslabel' >Address 1</label>
  <input  id='firstaddress' className='streetaddressinput' placeholder='Street Address'   />

  <label  for='secondaddress' className='streetaddress2label' >Address 2</label>
  <input  id='seconaddress' className='streetaddress2input' placeholder='Street Address 2'   />

  <label for='city' className='citylabel' >City </label>
  <input  id='city' className='cityinput' placeholder='City'  />

<label for='zip' className='ziplabel' > Zip Code </label>
<input className='zipinput' placeholder='Postal Code/Zip' id='zip' />

<label for='phone' className='phonelabel'>Phone</label>
<input  id='phone' className='phoneinput'  placeholder='+25471234567'  />

 <button type='submit'  className='btn_continue'  > Continue</button>
            </form>
           
    </div>


  )
}
