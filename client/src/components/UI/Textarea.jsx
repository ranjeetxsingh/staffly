import React from 'react';
import PropTypes from 'prop-types';

/**
 * Textarea Component
 * Multi-line text input
 */
const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showCount = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2 bg-white dark:bg-dark-800 border rounded-lg transition-all resize-none ${
          error
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300 dark:border-dark-600 focus:ring-primary-500'
        } ${
          disabled
            ? 'bg-gray-100 dark:bg-dark-900 cursor-not-allowed opacity-60'
            : ''
        } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2`}
        {...props}
      />

      <div className="flex items-center justify-between mt-1">
        <div className="flex-1">
          {(error || helperText) && (
            <p className={`text-sm ${error ? 'text-danger-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {error || helperText}
            </p>
          )}
        </div>
        {showCount && maxLength && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCount: PropTypes.bool,
  className: PropTypes.string,
};

export default Textarea;
