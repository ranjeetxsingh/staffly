import React from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar Component
 * User avatar with initials fallback
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  rounded = 'full',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizes[size]} ${roundedStyles[rounded]} object-cover`}
        />
      ) : (
        <div
          className={`${sizes[size]} ${roundedStyles[rounded]} bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold`}
        >
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusColors[status]} ${roundedStyles[rounded]} ring-2 ring-white dark:ring-dark-800`}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  className: PropTypes.string,
};

export default Avatar;
