import React from 'react';
import NavigationBar from '../../General Components/NavigationBar';
import Categories from '../Categories';
import './big.css';
import Pagination from '../../General Components/Pagination';

export default function Big() {

  return(
    <div>

<Pagination />
      <NavigationBar />
      <Categories />
    </div>
  )
}
