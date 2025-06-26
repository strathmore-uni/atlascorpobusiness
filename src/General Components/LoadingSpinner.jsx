import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  type = 'dots', 
  size = 'medium', 
  color = 'blue', 
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const spinnerClass = `loading-spinner ${type}-spinner ${size}-size ${color}-color ${fullScreen ? 'fullscreen' : ''} ${className}`;

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="dot-spinner">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="dot-spinner__dot"></div>
            ))}
          </div>
        );
      
      case 'ring':
        return (
          <div className="ring-spinner">
            <div className="ring-spinner__ring"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className="pulse-spinner">
            <div className="pulse-spinner__pulse"></div>
          </div>
        );
      
      case 'wave':
        return (
          <div className="wave-spinner">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="wave-spinner__bar"></div>
            ))}
          </div>
        );
      
      case 'bounce':
        return (
          <div className="bounce-spinner">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bounce-spinner__dot"></div>
            ))}
          </div>
        );
      
      case 'fade':
        return (
          <div className="fade-spinner">
            <div className="fade-spinner__circle"></div>
          </div>
        );
      
      case 'rotate':
        return (
          <div className="rotate-spinner">
            <div className="rotate-spinner__circle"></div>
          </div>
        );
      
      default:
        return (
          <div className="dot-spinner">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="dot-spinner__dot"></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={spinnerClass}>
      {renderSpinner()}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 