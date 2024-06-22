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
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleFormDataChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/review-order', { state: { formData } });
  }, [formData, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <label htmlFor='company_name'>Company Name  {errors.companyName && <div className="error">{errors.companyName}</div>} </label>
        <input
          type='text'
          placeholder='Company Name'
          id='company_name'
          className='inputs'
          name='companyName'
          value={formData.companyName}
          onChange={handleFormDataChange}
        />
   

        <label htmlFor='title' className='titleForm'>Title    {errors.title && <div className="error">{errors.title}</div>}</label>
     
        <select
          id="titleForm"
          value={formData.title}
          name='title'
          onChange={handleFormDataChange}
          className='input_title'
        >
          <option value="">Title</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Ms">Ms</option>
        </select>
      

        <label htmlFor='fname' className='fname'>First Name {errors.firstName && <div className="error">{errors.firstName}</div>}</label>
        <input
          id='fname'
          className='fnameinput'
          placeholder='First Name'
          name="firstName"
          value={formData.firstName}
          onChange={handleFormDataChange}
        />
     

        <label htmlFor='sname' className='sname'>Second Name     {errors.secondName && <div className="error">{errors.secondName}</div>}</label>
        <input
          id='sname'
          className='snameinput'
          placeholder='Second Name'
          name="secondName"
          value={formData.secondName}
          onChange={handleFormDataChange}
        />

        <label htmlFor='firstaddress' className='streetaddresslabel'>Address 1         {errors.address1 && <div className="error">{errors.address1}</div>}</label>
        <input
          id='firstaddress'
          className='streetaddressinput'
          placeholder='Street Address'
          name="address1"
          value={formData.address1}
          onChange={handleFormDataChange}
        />


        <label htmlFor='secondaddress' className='streetaddress2label'>Address 2         {errors.address2 && <div className="error">{errors.address2}</div>}</label>
        <input
          id='secondaddress'
          className='streetaddress2input'
          placeholder='Street Address 2'
          name="address2"
          value={formData.address2}
          onChange={handleFormDataChange}
        />


        <label htmlFor='city' className='citylabel'>City     {errors.city && <div className="error">{errors.city}</div>}</label>
        <input
          id='city'
          className='cityinput'
          placeholder='City'
          name='city'
          value={formData.city}
          onChange={handleFormDataChange}
        />
    

        <label htmlFor='zip' className='ziplabel'>Zip Code         {errors.zip && <div className="error">{errors.zip}</div>}</label>
        <input
          className='zipinput'
          placeholder='Postal Code/Zip'
          id='zip'
          name='zip'
          value={formData.zip}
          onChange={handleFormDataChange}
        />


        <label htmlFor='phone' className='phonelabel'>Phone         {errors.phone && <div className="error">{errors.phone}</div>}</label>
        <input
          type='number'
          id='phone'
          className='phoneinput'
          placeholder='+25471234567'
          name='phone'
          value={formData.phone}
          onChange={handleFormDataChange}
        />


        <label htmlFor='email' className='emaillabel'>Email </label>
        <input
          id='email'
          className='emailinput'
          placeholder='1234@gmail.com'
          name='email'
          value={formData.email}
          onChange={handleFormDataChange}
        />
    

        <button type='submit' className='btn_continue'>Continue</button>
      </form>
    </div>
  );
}
