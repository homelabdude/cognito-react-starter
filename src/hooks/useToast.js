import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast state and control functions
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showSuccess = useCallback((message) => {
    setToast({
      show: true,
      message,
      variant: "success",
    });
  }, []);

  const showError = useCallback((message) => {
    setToast({
      show: true,
      message,
      variant: "danger",
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return {
    toast,
    showSuccess,
    showError,
    hideToast,
  };
};
