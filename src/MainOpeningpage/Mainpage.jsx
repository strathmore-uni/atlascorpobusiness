import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from '../General Components/NavigationBar';
import { FaArrowRight, FaIndustry, FaTools, FaCog, FaShieldAlt, FaHeadset, FaTruck, FaAward, FaUsers, FaGlobe, FaStar, FaQuoteLeft, FaNewspaper, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPlay, FaCheckCircle } from "react-icons/fa";
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
    // Intersection Observer for fade-in
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
          description: 'Atlas Copco is a world leading provider of industrial productivity solutions, serving customers in Kenya for 88 years with innovative technology and exceptional service.',
          stats: {
            years: '88+',
            customers: '10,000+',
            products: '500+',
            support: '24/7'
          }
        };
      case 'Uganda':
        return {
          title: 'Atlas Copco Uganda',
          description: 'Atlas Copco provides exceptional industrial solutions tailored to meet the needs of Ugandan industries, enhancing productivity since its inception.',
          stats: {
            years: '25+',
            customers: '5,000+',
            products: '300+',
            support: '24/7'
          }
        };
      case 'Tanzania':
        return {
          title: 'Atlas Copco Tanzania',
          description: 'Atlas Copco Tanzania offers innovative solutions and unparalleled service to drive industrial progress in Tanzania.',
          stats: {
            years: '30+',
            customers: '7,500+',
            products: '400+',
            support: '24/7'
          }
        };
      default:
        return {
          title: 'Atlas Copco East Africa',
          description: 'Atlas Copco is dedicated to providing high-quality industrial solutions across East Africa, driving innovation and productivity.',
          stats: {
            years: '50+',
            customers: '15,000+',
            products: '800+',
            support: '24/7'
          }
        };
    }
  };

  const content = getCountrySpecificContent();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col">
      <NavigationBar cartItems={cartItems} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <FaAward className="text-yellow-400" />
                <span className="text-sm font-medium">Trusted by 15,000+ customers</span>
              </div>
              <h1 ref={el => (fadeRefs.current[0] = el)} className="text-5xl lg:text-7xl font-extrabold mb-6 opacity-0 translate-y-8 transition-all duration-700">
                {content.title}
              </h1>
              <h2 ref={el => (fadeRefs.current[1] = el)} className="text-2xl lg:text-3xl text-blue-200 font-semibold mb-4 opacity-0 translate-y-8 transition-all duration-700">
                Home of Industrial Ideas
              </h2>
              <p ref={el => (fadeRefs.current[2] = el)} className="text-xl text-blue-100 mb-8 leading-relaxed opacity-0 translate-y-8 transition-all duration-700">
                {content.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleContinueToShop}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  Explore Products <FaArrowRight />
                </button>
                <button className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20">
                  <FaPlay className="text-sm" /> Watch Video
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img
                  src="/images/fleetLink.jpg"
                  alt="Atlas Copco Hero"
                  className="rounded-2xl shadow-2xl w-full max-w-lg object-cover opacity-0 translate-y-8 transition-all duration-700"
                  ref={el => (fadeRefs.current[3] = el)}
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
    <div>
                      <p className="font-bold text-gray-900">Quality Assured</p>
                      <p className="text-sm text-gray-600">ISO 9001 Certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{content.stats.years}</div>
              <p className="text-gray-600 font-medium">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{content.stats.customers}</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{content.stats.products}</div>
              <p className="text-gray-600 font-medium">Quality Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{content.stats.support}</div>
              <p className="text-gray-600 font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive industrial solutions designed to maximize your productivity and efficiency
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FaIndustry className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrial Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete industrial productivity solutions including compressors, vacuum pumps, and power tools for manufacturing excellence.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <FaTools className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance & Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional maintenance services and technical support to ensure optimal performance of your equipment.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FaHeadset className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock customer support and emergency services to keep your operations running smoothly.
              </p>
            </div>
          </div>
        </div>
        </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
        <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
              <p className="text-xl text-gray-600">Discover our most sought-after industrial products</p>
            </div>
            <Link
              to="#"
              onClick={handleContinueToShop}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
            >
              View All Categories <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Filterelement')}
              ref={el => (fadeRefs.current[5] = el)}
            >
              <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <img src="/images/cq5dam.web.600.600.jpeg" alt="Filter Elements" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Filter Elements</p>
              <p className="text-sm text-gray-500 text-center mt-1">Air & Oil Filters</p>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Servkit')}
              ref={el => (fadeRefs.current[6] = el)}
            >
              <div className="w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <img src="/images/servkit.jpeg" alt="Serv Kits" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Serv Kits</p>
              <p className="text-sm text-gray-500 text-center mt-1">Service Kits</p>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Bearingkits')}
              ref={el => (fadeRefs.current[7] = el)}
            >
              <div className="w-20 h-20 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <img src="/images/bearingkit.jpeg" alt="Bearing Kits" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Bearing Kits</p>
              <p className="text-sm text-gray-500 text-center mt-1">Precision Bearings</p>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Overhaulkit')}
              ref={el => (fadeRefs.current[8] = el)}
            >
              <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                <img src="/images/kitoverhaul.jpeg" alt="Over Haul Kits" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Overhaul Kits</p>
              <p className="text-sm text-gray-500 text-center mt-1">Complete Kits</p>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Oilfilterelement')}
              ref={el => (fadeRefs.current[9] = el)}
            >
              <div className="w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                <img src="/images/filterkitdd_ddp.jpeg" alt="Oil filterelement" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Oil Filters</p>
              <p className="text-sm text-gray-500 text-center mt-1">Oil Filtration</p>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center cursor-pointer group border border-gray-100"
              onClick={() => handleCategoryClick('Autodrainvalve')}
              ref={el => (fadeRefs.current[10] = el)}
            >
              <div className="w-20 h-20 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                <img src="/images/cq5dam.web.600.600.jpeg" alt="Autodrain valve" className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-gray-800 text-center">Auto Drain Valves</p>
              <p className="text-sm text-gray-500 text-center mt-1">Drainage Solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-blue-200">Trusted by industry leaders across East Africa</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-3xl text-blue-300 mr-4" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                "Atlas Copco's industrial solutions have transformed our manufacturing process. Their quality and service are unmatched."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">John Mwangi</p>
                  <p className="text-blue-200">Production Manager, Kenya</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-3xl text-blue-300 mr-4" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                "The 24/7 support and maintenance services have kept our operations running smoothly for years."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Sarah Nalukenge</p>
                  <p className="text-blue-200">Operations Director, Uganda</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-3xl text-blue-300 mr-4" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                "Outstanding product quality and exceptional customer service. Atlas Copco is our trusted partner."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Ahmed Hassan</p>
                  <p className="text-blue-200">CEO, Tanzania Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600">Stay informed about industry trends and company updates</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src="/images/serviceTips.jpg" alt="Service Tips" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                  <FaNewspaper />
                  <span>Service Tips</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Essential Maintenance Tips for Industrial Compressors</h3>
                <p className="text-gray-600 mb-4">
                  Learn the best practices for maintaining your industrial compressors to ensure optimal performance and longevity.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Read More →</button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src="/images/GA 90.jpeg" alt="New Products" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                  <FaNewspaper />
                  <span>New Products</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Introducing the New GA 90 Series Compressors</h3>
                <p className="text-gray-600 mb-4">
                  Discover our latest innovation in air compression technology with improved efficiency and reliability.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Read More →</button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src="/images/fleetLink.jpg" alt="Industry News" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-purple-600 mb-3">
                  <FaNewspaper />
                  <span>Industry News</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Manufacturing Trends in 2024</h3>
                <p className="text-gray-600 mb-4">
                  Explore the latest trends in sustainable manufacturing and how Atlas Copco is leading the way.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Read More →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact our expert team today to discuss your industrial needs and discover how we can help optimize your operations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100">+254 700 000 000</p>
              <p className="text-blue-100">+256 700 000 000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100">info@atlascopco.co.ke</p>
              <p className="text-blue-100">support@atlascopco.co.ke</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-100">Nairobi, Kenya</p>
              <p className="text-blue-100">Kampala, Uganda</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleContinueToShop}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Start Shopping Now <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

        <Footer />
    </div>
  );
}
