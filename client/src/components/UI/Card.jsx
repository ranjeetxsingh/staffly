import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component
 * A container component with various styles and options
 */
const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-dark-800 dark:border-dark-700';
  
  const variants = {
    default: '',
    elevated: 'shadow-md hover:shadow-lg transition-shadow',
    bordered: 'border-2',
    gradient: 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-none',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hoverable ? 'hover:shadow-lg transition-all cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && <div className="ml-4">{headerAction}</div>}
          </div>
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerAction: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
