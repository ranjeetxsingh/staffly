import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tabs Component
 * Tabbed interface with panels
 */
const Tabs = ({
  tabs = [],
  defaultActiveTab = 0,
  variant = 'default',
  className = '',
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab);

  const variants = {
    default: {
      container: 'border-b border-gray-200 dark:border-dark-700',
      tab: 'border-b-2 px-4 py-2',
      active: 'border-primary-500 text-primary-600 dark:text-primary-400',
      inactive: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-dark-600',
    },
    pills: {
      container: 'gap-2',
      tab: 'px-4 py-2 rounded-lg',
      active: 'bg-primary-600 text-white',
      inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
    },
    boxed: {
      container: 'border border-gray-200 dark:border-dark-700 rounded-lg p-1 gap-1',
      tab: 'px-4 py-2 rounded-md',
      active: 'bg-white dark:bg-dark-800 shadow-sm text-primary-600 dark:text-primary-400',
      inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${currentVariant.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            disabled={tab.disabled}
            className={`${currentVariant.tab} font-medium text-sm transition-all ${
              activeTab === index
                ? currentVariant.active
                : currentVariant.inactive
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  defaultActiveTab: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'pills', 'boxed']),
  className: PropTypes.string,
};

export default Tabs;
