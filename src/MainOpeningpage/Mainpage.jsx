import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from '../General Components/NavigationBar';
// import './mainpage.css'; // Removed old CSS
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../General Components/Footer';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function Mainpage({ cartItems, datas, handleAddProductDetails }) {
  const { IsAuthenticated, currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const navigate = useNavigate();
  const fadeRefs = useRef([]);
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    // Fetch user's country based on email when component mounts.
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get(`/api/user/profile?email=${userEmail}`);
        setUserCountry(response.data.country);
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };
    if (IsAuthenticated && userEmail) {
      fetchUserCountry();
    }
    // Intersection Observer for fade-in (optional, can be replaced with Tailwind transitions)
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
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
    if (currentUser && userEmail) {
      navigate('/shop');
    } else {
      navigate('/signin', { state: { redirectTo: '/shop' } });
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavigationBar cartItems={cartItems} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="flex-1 text-center md:text-left">
            <h1 ref={el => (fadeRefs.current[0] = el)} className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 opacity-0 translate-y-8 transition-all duration-700">{content.title}</h1>
            <h2 ref={el => (fadeRefs.current[1] = el)} className="text-xl md:text-2xl text-blue-700 font-semibold mb-2 opacity-0 translate-y-8 transition-all duration-700">Home of Industrial Ideas</h2>
            <p ref={el => (fadeRefs.current[2] = el)} className="text-gray-700 mb-6 opacity-0 translate-y-8 transition-all duration-700">{content.description}</p>
            <button
              onClick={handleContinueToShop}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Continue to Shop <FaArrowRight />
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/images/fleetLink.jpg"
              alt="Atlas Copco Hero"
              className="rounded-xl shadow-lg w-full max-w-md object-cover opacity-0 translate-y-8 transition-all duration-700"
              ref={el => (fadeRefs.current[3] = el)}
            />
          </div>
        </section>

        {/* Why Us Section */}
        <section className="bg-white rounded-2xl shadow p-8 mb-12 flex flex-col md:flex-row gap-8 items-center">
          <img
            src="/R.png"
            alt="Atlas Copco Logo"
            className="w-32 h-32 object-contain mb-4 md:mb-0 opacity-0 translate-y-8 transition-all duration-700"
            ref={el => (fadeRefs.current[4] = el)}
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">Why Us?</h3>
            <p className="text-gray-700 leading-relaxed">
              Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing, and process industries, construction, automotives, electronics, oil and gas, and much more. Atlas Copco handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electric, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.
            </p>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Popular Categories</h2>
            <Link
              to="#"
              onClick={handleContinueToShop}
              className="text-blue-600 hover:underline font-medium"
            >
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {/* Example Categories */}
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Filterelement')}
              ref={el => (fadeRefs.current[5] = el)}
            >
              <img src="/images/cq5dam.web.600.600.jpeg" alt="Filter Elements" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Filter Elements</p>
            </div>
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Servkit')}
              ref={el => (fadeRefs.current[6] = el)}
            >
              <img src="/images/servkit.jpeg" alt="Serv Kits" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Serv Kits</p>
            </div>
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Bearingkits')}
              ref={el => (fadeRefs.current[7] = el)}
            >
              <img src="/images/bearingkit.jpeg" alt="Bearing Kits" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Bearing Kits</p>
            </div>
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Overhaulkit')}
              ref={el => (fadeRefs.current[8] = el)}
            >
              <img src="/images/kitoverhaul.jpeg" alt="Over Haul Kits" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Over Haul Kits</p>
            </div>
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Oilfilterelement')}
              ref={el => (fadeRefs.current[9] = el)}
            >
              <img src="/images/filterkitdd_ddp.jpeg" alt="Oil filterelement" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Oil filterelement</p>
            </div>
            <div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer group opacity-0 translate-y-8 transition-all duration-700"
              onClick={() => handleCategoryClick('Autodrainvalve')}
              ref={el => (fadeRefs.current[10] = el)}
            >
              <img src="/images/cq5dam.web.600.600.jpeg" alt="Autodrain valve" className="w-24 h-24 object-cover rounded mb-2 group-hover:scale-105 transition" />
              <p className="font-semibold text-gray-800">Autodrain valve</p>
            </div>
            {/* More categories can be added here */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
