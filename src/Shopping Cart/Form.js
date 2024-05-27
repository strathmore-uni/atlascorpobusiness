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
      {errors.companyName && <div className="error">{errors.companyName}</div>}
        <label htmlFor='company_name'>Company Name </label>
        <input
          type='text'
          placeholder='Company Name'
          id='company_name'
          className='inputs'
          name='companyName'
          value={formData.companyName}
          onChange={handleFormDataChange}
        />
   

        <label htmlFor='title' className='title'>Title</label>
        {errors.title && <div className="error">{errors.title}</div>}
        <select
          id="title"
          value={formData.title}
          name='title'
          onChange={handleFormDataChange}
          className='input_title'
        >
          <option value="">Title</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
        </select>
      

        <label htmlFor='fname' className='fname'>First Name</label>
        <input
          id='fname'
          className='fnameinput'
          placeholder='First Name'
          name="firstName"
          value={formData.firstName}
          onChange={handleFormDataChange}
        />
        {errors.firstName && <div className="error">{errors.firstName}</div>}

        <label htmlFor='sname' className='sname'>Second Name</label>
        <input
          id='sname'
          className='snameinput'
          placeholder='Second Name'
          name="secondName"
          value={formData.secondName}
          onChange={handleFormDataChange}
        />
        {errors.secondName && <div className="error">{errors.secondName}</div>}

        <label htmlFor='firstaddress' className='streetaddresslabel'>Address 1</label>
        <input
          id='firstaddress'
          className='streetaddressinput'
          placeholder='Street Address'
          name="address1"
          value={formData.address1}
          onChange={handleFormDataChange}
        />
        {errors.address1 && <div className="error">{errors.address1}</div>}

        <label htmlFor='secondaddress' className='streetaddress2label'>Address 2</label>
        <input
          id='secondaddress'
          className='streetaddress2input'
          placeholder='Street Address 2'
          name="address2"
          value={formData.address2}
          onChange={handleFormDataChange}
        />
        {errors.address2 && <div className="error">{errors.address2}</div>}

        <label htmlFor='city' className='citylabel'>City</label>
        <input
          id='city'
          className='cityinput'
          placeholder='City'
          name='city'
          value={formData.city}
          onChange={handleFormDataChange}
        />
        {errors.city && <div className="error">{errors.city}</div>}

        <label htmlFor='zip' className='ziplabel'>Zip Code</label>
        <input
          className='zipinput'
          placeholder='Postal Code/Zip'
          id='zip'
          name='zip'
          value={formData.zip}
          onChange={handleFormDataChange}
        />
        {errors.zip && <div className="error">{errors.zip}</div>}

        <label htmlFor='phone' className='phonelabel'>Phone</label>
        <input
          type='number'
          id='phone'
          className='phoneinput'
          placeholder='+25471234567'
          name='phone'
          value={formData.phone}
          onChange={handleFormDataChange}
        />
        {errors.phone && <div className="error">{errors.phone}</div>}

        <label htmlFor='email' className='emaillabel'>Email</label>
        <input
          id='email'
          className='emailinput'
          placeholder='1234@gmail.com'
          name='email'
          value={formData.email}
          onChange={handleFormDataChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <button type='submit' className='btn_continue'>Continue</button>
      </form>
    </div>
  );
}
