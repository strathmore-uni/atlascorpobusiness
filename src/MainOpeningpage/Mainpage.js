import React,{useState,useEffect} from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './mainpage.css'
import { FaArrowRight } from "react-icons/fa";
import Footer from '../General Components/Footer';
import { Link } from 'react-router-dom';

export default function Mainpage() {

  const images = [
    '/images/QAS generator.jpeg',
    '/images/GA 90.jpeg',
    '/images/XAS97.jpeg',
    '/images/Y35 compressor.jpeg',
    '/images/ZR 132 FF.jpeg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(images.length - 1);
  const [nextImageIndex, setNextImageIndex] = useState(1);

  const goToNextImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setPrevImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setNextImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setPrevImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setNextImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(goToNextImage, 3000); // Change the interval time as per your requirement (e.g., 3000ms for 3 seconds)

    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  });
  return (
    <div>
    

<div className='mainpage_container'>


<div className='container_media' >
<img src={images[prevImageIndex]} alt='' className='image1' style={{opacity:'.5'}} />
          <img src={images[currentImageIndex]} alt='' className='image2'   />
          <img src={images[nextImageIndex]} alt='' className='image3'  style={{opacity:'.5'}} />
          <div className="arrow_left" onClick={goToPrevImage}>
            &lt;
          </div>
          <div className="arrow_right" onClick={goToNextImage}>
            &gt;
          </div>
</div>


  <section>
<p className='main_p' >Atlas Copco Kenya- Home of Industrial ideas</p>
    
    <p className='submain_p' >Atlas Copco is a world leading provider of industrial productivity solutions, serving customers in Kenya for  88 years.. </p>
  
  <p className='sub_p_sub'>Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing and process industries, construction, automotives, electronics, oil and gas and much more.

Atlas Copco in Kenya handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electic, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.  </p>
  </section>

 
 <Link to='/Shop' style={{color:'black'}} > <div className='shopwithus'>
   <FaArrowRight className='shopwithus_arrowright' />

  <h3>Shop With Us</h3>



</div></Link>


</div>


<NavigationBar  />
  <Footer />
    </div>
  )
}
