import React from 'react';
import PropTypes from 'prop-types';

/**
 * Switch Component
 * Toggle switch input
 */
const Switch = ({
  label,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      circle: 'h-4 w-4',
      translate: checked ? 'translate-x-4' : 'translate-x-0',
    },
    md: {
      switch: 'h-6 w-11',
      circle: 'h-5 w-5',
      translate: checked ? 'translate-x-5' : 'translate-x-0',
    },
    lg: {
      switch: 'h-7 w-14',
      circle: 'h-6 w-6',
      translate: checked ? 'translate-x-7' : 'translate-x-0',
    },
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex ${sizes[size].switch} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked
            ? 'bg-primary-600'
            : 'bg-gray-200 dark:bg-dark-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`${sizes[size].circle} ${sizes[size].translate} pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out`}
        />
      </button>
      {label && (
        <span
          className={`ml-3 text-sm font-medium ${
            disabled
              ? 'text-gray-400 dark:text-gray-600'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

Switch.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Switch;
