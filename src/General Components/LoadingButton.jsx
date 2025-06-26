import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './LoadingButton.css';

const LoadingButton = ({
  children,
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  spinnerType = 'ring',
  spinnerSize = 'small',
  spinnerColor = 'white',
  className = '',
  variant = 'primary', // primary, secondary, danger, success
  size = 'medium', // small, medium, large
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'loading-button';
  const variantClasses = {
    primary: 'loading-button--primary',
    secondary: 'loading-button--secondary',
    danger: 'loading-button--danger',
    success: 'loading-button--success'
  };
  const sizeClasses = {
    small: 'loading-button--small',
    medium: 'loading-button--medium',
    large: 'loading-button--large'
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'loading-button--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="loading-button__content">
          <LoadingSpinner
            type={spinnerType}
            size={spinnerSize}
            color={spinnerColor}
            text=""
          />
          <span className="loading-button__text">{loadingText}</span>
        </div>
      ) : (
        <span className="loading-button__text">{children}</span>
      )}
    </button>
  );
};

export default LoadingButton; 