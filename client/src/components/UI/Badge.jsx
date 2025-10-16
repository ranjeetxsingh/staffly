import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * A label badge for displaying status, tags, etc.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300',
    info: 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-300',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const roundedStyles = {
    none: 'rounded-none',
    default: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[rounded]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'default', 'md', 'lg', 'full']),
  className: PropTypes.string,
};

export default Badge;
