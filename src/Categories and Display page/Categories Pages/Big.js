import React from 'react';
import NavigationBar from '../../General Components/NavigationBar';
import Categories from '../Categories';
import './big.css';
import Pagination from '../../General Components/Pagination';
import Footer from '../../General Components/Footer';

export default function Big({fulldatas}) {
  console.log(fulldatas);

  return(
    <div className='big_cont'>

      {fulldatas.map((product)=> (
        <p>{product.image}</p>
      ))}

<Pagination />
      <NavigationBar />
      <Categories />
      <Footer />
    </div>
  )
}
