/**
 * Rules for form validation
 * Each rule is a function that returns an error message or null if validation passes
 */
const validationRules = {
  required: (value, fieldName) => {
    return !value ? `${fieldName} is required` : null;
  },

  email: (value) => {
    return value && !/\S+@\S+\.\S+/.test(value)
      ? "Please enter a valid email address"
      : null;
  },

  minLength: (value, min) => {
    return value && value.length < min
      ? `Must be at least ${min} characters`
      : null;
  },

  passwordMatch: (value, confirmValue) => {
    return value !== confirmValue ? "Passwords do not match" : null;
  },
};

/**
 * Form field configuration for different forms
 */
export const formConfig = {
  login: {
    userormail: [{ rule: "required", params: ["Username/Email"] }],
    password: [{ rule: "required", params: ["Password"] }],
  },

  register: {
    email: [{ rule: "required", params: ["Email"] }, { rule: "email" }],
    username: [{ rule: "required", params: ["Username"] }],
    password: [
      { rule: "required", params: ["Password"] },
      { rule: "minLength", params: [8] },
    ],
    confirmPassword: [
      { rule: "required", params: ["Password confirmation"] },
      { rule: "passwordMatch", fieldToMatch: "password" },
    ],
  },
};

/**
 * Validates a single form field
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @param {object} formValues - All form values for cross-field validation
 * @param {string} formType - Form type (e.g. 'login', 'register')
 * @returns {string|null} Error message or null if validation passes
 */
export const validateField = (field, value, formValues, formType) => {
  const fieldRules = formConfig[formType]?.[field];

  if (!fieldRules) return null;

  for (const validation of fieldRules) {
    const { rule, params = [], fieldToMatch } = validation;

    // For rules that need to compare with another field's value
    if (fieldToMatch && formValues) {
      const result = validationRules[rule](
        value,
        formValues[fieldToMatch],
        ...params
      );
      if (result) return result;
    } else {
      // Standard validation
      const result = validationRules[rule](value, ...params);
      if (result) return result;
    }
  }

  return null;
};

/**
 * Validates an entire form
 * @param {object} formValues - Object with all form values
 * @param {string} formType - Form type (e.g. 'login', 'register')
 * @returns {object} Object with field names as keys and error messages as values
 */
export const validateForm = (formValues, formType) => {
  const errors = {};
  const config = formConfig[formType];

  if (!config) return errors;

  // Validate each field in the form
  Object.keys(config).forEach((field) => {
    const value = formValues[field];
    const error = validateField(field, value, formValues, formType);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

/**
 * Creates a handler function to update form values and perform validation on input
 * @param {Function} setFormValues - useState setter for form values
 * @param {Function} setErrors - useState setter for form errors
 * @returns {Function} Handler function to update form values
 */
export const createInputHandler = (setFormValues, setErrors) => {
  return (e) => {
    const { name, value } = e.target;

    // Update form values
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error if field was previously empty but now has a value
    setErrors((prev) => {
      if (prev[name] && value && prev[name].includes("required")) {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      }
      return prev;
    });
  };
};

/**
 * Creates a handler function for blur events to validate field on blur
 * @param {Function} setFormValues - useState setter for form values
 * @param {Function} setErrors - useState setter for form errors
 * @param {string} formType - Form type (e.g. 'login', 'register')
 * @param {Function} getCurrentFormValues - Function to get current form values
 * @returns {Function} Handler function to validate field on blur
 */
export const createBlurHandler = (
  setFormValues,
  setErrors,
  formType,
  getCurrentFormValues
) => {
  return (e) => {
    const { name, value } = e.target;
    const formValues = getCurrentFormValues();

    // Update form value
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Validate field
    const error = validateField(name, value, formValues, formType);

    // Update errors
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[name] = error;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };
};
