import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Form() {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    firstName: '',
    secondName: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    phone: '',
  });

  const handleFormDataChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    navigate('/review-order', { state: { formData } });
  }, [formData, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label for='company_name'>Company Name </label>
        <input type='text' placeholder='Company Name' id='company_name' className='inputs' name='companyName' value={formData.companyName} onChange={handleFormDataChange} />

        <label  for='title' className='title'  >Title</label>

        <select id="title" value={formData.title} name='title' onChange={handleFormDataChange} className='input_title'  >
            <option value="">Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
          </select>

        <label  for='fname' className='fname' name="firstName" >First Name</label>
        <input  id='fname' className='fnameinput' placeholder='First Name' name="firstName" value={formData.firstName} onChange={handleFormDataChange} /> 

        <label  for='sname' className='sname' >Second Name</label>
        <input  id='sname' className='snameinput' placeholder='Second Name' name="secondName" value={formData.secondName} onChange={handleFormDataChange} /> 

        <label  for='firstaddress' className='streetaddresslabel'  >Address 1</label>
        <input  id='firstaddress' className='streetaddressinput' placeholder='Street Address' name="address1" value={formData.address1} onChange={handleFormDataChange} />

        <label  for='secondaddress' className='streetaddress2label' >Address 2</label>
        <input  id='seconaddress' className='streetaddress2input' placeholder='Street Address 2' name="address2" value={formData.address2} onChange={handleFormDataChange} />

        <label for='city' className='citylabel' >City </label>
        <input  id='city' className='cityinput' placeholder='City' name='city' value={formData.city} onChange={handleFormDataChange} />

        <label for='zip' className='ziplabel' > Zip Code </label>
        <input className='zipinput' placeholder='Postal Code/Zip' id='zip' name='zip' value={formData.zip} onChange={handleFormDataChange} />

        <label for='phone' className='phonelabel'>Phone</label>
        <input  id='phone' className='phoneinput'  placeholder='+25471234567' name='phone' value={formData.phone} onChange={handleFormDataChange} />

       <button type='submit'  className='btn_continue'  > Continue</button>
      </form>
    </div>
  );
}