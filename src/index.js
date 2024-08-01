import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './MainOpeningpage/AuthContext';
import { ThemeProvider } from './ThemeProvider';

 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider>
      
          <App />
    
          </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();