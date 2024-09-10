import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from '../General Components/NavigationBar';
import './mainpage.css';
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../General Components/Footer';
import { useAuth } from './AuthContext';
import axios from 'axios'; // Ensure axios is installed and imported for API requests.

export default function Mainpage({ cartItems, datas, handleAddProductDetails }) {
  const userEmail = localStorage.getItem('userEmail');
  const { IsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fadeRefs = useRef([]);
  const [userCountry, setUserCountry] = useState(null); // State to hold the user's country.

  useEffect(() => {
    console.log(`IsAuthenticated: ${IsAuthenticated}`);

    // Fetch user's country based on email when component mounts.
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get(`/api/user/profile?email=${userEmail}`);
        setUserCountry(response.data.country); // Assume the API returns user's country in the 'country' field.
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    if (IsAuthenticated && userEmail) {
      fetchUserCountry();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      fadeRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [IsAuthenticated, userEmail]);

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  const handleContinueToShop = () => {
    if (!IsAuthenticated) {
      navigate('/signin', { state: { redirectTo: '/shop' } });
    } else {
      navigate('/shop');
    }
  };

  // Define content dynamically based on the user's country.
  const getCountrySpecificContent = () => {
    switch (userCountry) {
      case 'Kenya':
        return {
          title: 'Atlas Copco Kenya',
          description: 'Atlas Copco is a world leading provider of industrial productivity solutions, serving customers in Kenya for 88 years..',
        };
      case 'Uganda':
        return {
          title: 'Atlas Copco Uganda',
          description: 'Atlas Copco provides exceptional industrial solutions tailored to meet the needs of Ugandan industries, enhancing productivity since its inception.',
        };
      case 'Tanzania':
        return {
          title: 'Atlas Copco Tanzania',
          description: 'Atlas Copco Tanzania offers innovative solutions and unparalleled service to drive industrial progress in Tanzania.',
        };
      default:
        return {
          title: 'Atlas Copco East Africa',
          description: 'Atlas Copco is dedicated to providing high-quality industrial solutions across East Africa.',
        };
    }
  };

  const content = getCountrySpecificContent();

  return (
    <div>
      <div className='mainpage_container'>
        <div className='container_media'>
         
        </div>

        <section>
          <p ref={(el) => (fadeRefs.current[0] = el)} className='main_p fade-in'>
            {content.title}
          </p>
          <p ref={(el) => (fadeRefs.current[1] = el)} className='main_sub_P fade-in'>
            Home of Industrial Ideas
          </p>
          <p ref={(el) => (fadeRefs.current[2] = el)} className='submain_p fade-in'>
            {content.description}
          </p>
        </section>

        <div>
          <p ref={(el) => (fadeRefs.current[3] = el)} className='sub_p_sub fade-in'>
            <p>Why Us?</p>
            Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing, and process industries, construction, automotives, electronics, oil and gas, and much more. Atlas Copco handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electric, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.
          </p>
        </div>

        <img src='./public/R.png' alt='' ref={(el) => (fadeRefs.current[4] = el)} className='fade-in' />

        <div className='shopwithus'>
          <img src='/images/fleetLink.jpg' alt='' className='imageshop_withus fade-in' ref={(el) => (fadeRefs.current[5] = el)} />
          <h3 className='fade-in' ref={(el) => (fadeRefs.current[6] = el)}>
            Shop more than 75,000 original Atlas Copco spare parts now!
          </h3>
        </div>

        <div className='featuredproducts_mainpage'>
          <Link to="#" onClick={handleContinueToShop} style={{ textDecoration: 'none' }}>
            <h2 className='fade-in' ref={(el) => (fadeRefs.current[7] = el)}>Popular Categories</h2>
          </Link>
          <button onClick={handleContinueToShop} className='btn_toShop fade-in' ref={(el) => (fadeRefs.current[8] = el)}>
            Continue to Shop <FaArrowRight />
          </button>

          <div className='mainpage_products'>
            {/* Example Categories */}
            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Filterelement')} ref={(el) => (fadeRefs.current[9] = el)}>
              <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images' />
              <p>Filter Elements</p>
            </div>
            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Servkit')} ref={(el) => (fadeRefs.current[10] = el)}>
              <img src='/images/servkit.jpeg' alt='' className='individual_images' />
              <p>Serv Kits</p>
            </div>

            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Bearingkits')} ref={(el) => (fadeRefs.current[11] = el)}>
              <img src='/images/bearingkit.jpeg' alt='' className='individual_images' />
              <p>Bearing Kits</p>
            </div>

            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Overhaulkit')} ref={(el) => (fadeRefs.current[12] = el)}>
              <img src='/images/kitoverhaul.jpeg' alt='' className='individual_images' />
              <p>Over Haul Kits</p>
            </div>

            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Oilfilterelement')} ref={(el) => (fadeRefs.current[13] = el)}>
              <img src='/images/filterkitdd_ddp.jpeg' alt='' className='individual_images' />
              <p>Oil filterelement</p>
            </div>

            <div className='individual_categories fade-in' onClick={() => handleCategoryClick('Autodrainvalve')} ref={(el) => (fadeRefs.current[14] = el)}>
              <img src='/images/cq5dam.web.600.600.jpeg' alt='' className='individual_images' />
              <p>Autodrain valve</p>
            </div>
            {/* More categories */}
          </div>
        </div>
      </div>

      <NavigationBar cartItems={cartItems} />
      <div className='mainpage_footer'>
        <Footer />
      </div>
    </div>
  );
}
