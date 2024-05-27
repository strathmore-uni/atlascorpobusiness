import React,{useState,useEffect} from 'react'
import NavigationBar from '../General Components/NavigationBar'
import './mainpage.css'
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Footer from '../General Components/Footer';
import { LuCameraOff } from "react-icons/lu";
export default function Mainpage({cartItems,datas,handleAddProductDetails}) {

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


  const navigate = useNavigate();


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
    const intervalId = setInterval(goToNextImage, 3000); 

    return () => clearInterval(intervalId); 
  });

  const handleProductClick = (product) => {
    handleAddProductDetails(product);
    navigate('/Productdetails', { state: { product } });
  };
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
<p className='main_p' ><b style={{fontSize:'3rem'}} >Atlas Copco Kenya</b> Home of Industrial ideas</p>
    
    <p className='submain_p' ><b style={{fontSize:'2rem'}} >Atlas Copco</b> is a world leading provider of industrial productivity solutions, serving customers in Kenya for  88 years.. </p>
  
  <p className='sub_p_sub'><p   >
    Why Us?
    </p>
    Our products help customers achieve sustainable productivity in a wide range of markets, including engineering, manufacturing and process industries, construction, automotives, electronics, oil and gas and much more.

Atlas Copco in Kenya handles sales and service of industrial gas and air compressors, dryers and filters, compressor parts and service; vacuum pumps and solutions; construction and demolition tools including mobile compressors, pumps, light towers and generators; industrial electic, pneumatic, assembly tools, as well as an extensive range of pneumatic grinders and drills.  </p>
  </section>

<img className='img_mainpage'  src="./public/R.png" alt='' />
 
 <Link to='/Shop' style={{color:'black'}} > <div className='shopwithus'>
   <FaArrowRight className='shopwithus_arrowright' />

  <h3>Shop With Us</h3>





</div></Link>

<div className='featuredproducts_mainpage' >
<Link to="/Shop" style={{textDecoration:'none'}}><h2>Featured products</h2> </Link>
<h3>Filter Elements </h3>
<a  className='linktoviewmore'  href='/Shop' >View more<FaArrowRight  /></a>
<div  className='mainpage_products'>

{datas.map((product) => (


   <Link key={product.partnumber}  className='mylinks_mainpage' 
          
          to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}onClick={() => handleProductClick(product)} > 

            <img className=' prdt_image' src={product.image} alt='' />
            <p className='cameraoff_icon'  ><LuCameraOff /></p>
          <p className='prdt_partnumber'> {product.partnumber}</p>
          {/** */}
            <p  className='prdt_title'  >{product.Description}   </p>
            <p  className='prdt_category'  >{product.category}   </p>
            <p  className='prdt_price'  >USD {product.Price}   </p>
       </Link>
  
))}
  </div>
</div>


</div>


<NavigationBar cartItems={cartItems}/>
<div className='mainpage_footer' >
         <Footer  />
      </div>
    </div>
  )
}
