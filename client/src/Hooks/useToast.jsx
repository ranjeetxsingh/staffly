import { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback to react-toastify if not in provider
    return {
      showSuccess: (message) => toast.success(message),
      showError: (message) => toast.error(message),
      showWarning: (message) => toast.warning(message),
      showInfo: (message) => toast.info(message),
      addToast: (message, type) => toast[type](message),
    };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showSuccess = useCallback((message, duration = 3000) => {
    toast.success(message, { autoClose: duration });
  }, []);

  const showError = useCallback((message, duration = 3000) => {
    toast.error(message, { autoClose: duration });
  }, []);

  const showWarning = useCallback((message, duration = 3000) => {
    toast.warning(message, { autoClose: duration });
  }, []);

  const showInfo = useCallback((message, duration = 3000) => {
    toast.info(message, { autoClose: duration });
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    toast[type](message, { autoClose: duration });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
