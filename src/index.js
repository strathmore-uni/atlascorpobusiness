import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import { ProductsProvider } from './MainOpeningpage/ProductsContext';
import { AuthProvider } from './MainOpeningpage/AuthContext';

 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductsProvider>
      
          <App />
    
      </ProductsProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();