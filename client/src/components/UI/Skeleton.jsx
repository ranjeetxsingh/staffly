import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton Loader Component
 * Loading placeholder for content
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  animate = true,
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    circle: 'rounded-full',
    rectangular: 'rounded-lg',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 rounded-lg',
    card: 'h-32 rounded-lg',
  };

  const baseClass = `bg-gray-200 dark:bg-dark-700 ${
    animate ? 'animate-pulse' : ''
  } ${variants[variant]}`;

  const style = {
    width: width || '100%',
    height: height || (variants[variant].includes('h-') ? undefined : '1rem'),
  };

  if (count > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={baseClass} style={style} />
        ))}
      </div>
    );
  }

  return <div className={`${baseClass} ${className}`} style={style} />;
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf([
    'text',
    'title',
    'circle',
    'rectangular',
    'avatar',
    'button',
    'card',
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  className: PropTypes.string,
  animate: PropTypes.bool,
};

export default Skeleton;
