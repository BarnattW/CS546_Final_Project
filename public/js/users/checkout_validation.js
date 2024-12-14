document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const fields = {
      fullName: {
          element: document.getElementById('full-name'),
          validate: (value) => value.trim() !== '' && /^[a-zA-Z ]+$/.test(value),
          error: 'Please enter a valid full name.'
      },
      address: {
          element: document.getElementById('address'),
          validate: (value) => value.trim() !== '',
          error: 'Address cannot be empty.'
      },
      city: {
          element: document.getElementById('city'),
          validate: (value) => value.trim() !== '' && /^[a-zA-Z ]+$/.test(value),
          error: 'Please enter a valid city name.'
      },
      state: {
          element: document.getElementById('state'),
          validate: (value) => value.trim() !== '' && /^[a-zA-Z ]+$/.test(value),
          error: 'Please enter a valid state name.'
      },
      zipCode: {
          element: document.getElementById('zip-code'),
          validate: (value) => /^[0-9]{5}(?:-[0-9]{4})?$/.test(value),
          error: 'Please enter a valid ZIP code.'
      },
          country: {
          element: document.getElementById('country'),
          validate: (value) => value.trim() !== '' && /^[a-zA-Z ]+$/.test(value),
          error: 'Please enter a valid country name.'
      }
  };

  const showError = (field, message) => {
      let errorElement = field.nextElementSibling;
      if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('span');
          errorElement.className = 'error-message';
          errorElement.style.color = 'red';
          errorElement.style.fontSize = '0.9em';
          field.parentNode.insertBefore(errorElement, field.nextSibling);
      }
      errorElement.textContent = message;
  };

  const clearError = (field) => {
      const errorElement = field.nextElementSibling;
      if (errorElement && errorElement.classList.contains('error-message')) {
          errorElement.remove();
      }
  };

  Object.values(fields).forEach(({ element, validate, error }) => {
      element.addEventListener('blur', () => {
          if (!validate(element.value)) {
              showError(element, error);
          } else {
              clearError(element);
          }
      });
  });

  form.addEventListener('submit', (event) => {
      let isValid = true;
      Object.values(fields).forEach(({ element, validate, error }) => {
          if (!validate(element.value)) {
              showError(element, error);
              isValid = false;
          } else {
              clearError(element);
          }
      });

      if (!isValid) {
          event.preventDefault(); 
          alert('Please fix the errors in the form before submitting.');
      }
  });
});
