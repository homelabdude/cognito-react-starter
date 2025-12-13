/**
 * Validates and sanitizes person form fields based on field type
 * @param {string} fieldName - The name of the field being validated
 * @param {string} value - The new value to validate
 * @param {string} currentValue - The current value (used for age validation)
 * @returns {string} The validated/sanitized value
 */
export const validatePersonField = (fieldName, value, currentValue) => {
  let newValue = value;

  if (
    fieldName === "firstName" ||
    fieldName === "lastName" ||
    fieldName === "tag"
  ) {
    // Only allow letters and spaces, max 20 characters
    newValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (newValue.length > 20) {
      newValue = newValue.substring(0, 20);
    }
  } else if (fieldName === "age") {
    // Only allow digits
    newValue = value.replace(/\D/g, "");
    // Validate age range 0-120
    if (
      newValue !== "" &&
      (parseInt(newValue) < 0 || parseInt(newValue) > 120)
    ) {
      newValue = currentValue; // Keep previous valid value
    }
  } else if (fieldName === "phoneNumber") {
    // Allow + at the beginning and digits
    newValue = value.replace(/(?:\+|(?!^))\+|[^+\d]/g, "");
    if (newValue.length > 20) {
      newValue = newValue.substring(0, 20);
    }
  }

  return newValue;
};
