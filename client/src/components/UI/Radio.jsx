import React from 'react';
import PropTypes from 'prop-types';

/**
 * Radio Component
 * Radio input with label
 */
const Radio = ({
  name,
  label,
  value,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500 ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          } ${error ? 'border-danger-500' : ''}`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label
            className={`text-sm font-medium ${
              disabled
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 cursor-pointer'
            }`}
          >
            {label}
          </label>
          {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Radio;
