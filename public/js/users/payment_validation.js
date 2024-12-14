document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  const fields = {
      cardNumber: {
          element: document.getElementById('card-number'),
          validate: (value) => /^[0-9]{16}$/.test(value),
          error: 'Please enter a valid 16-digit card number.'
      },
      expiryDate: {
          element: document.getElementById('expiry-date'),
          validate: (value) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value), 
          error: 'Please enter a valid expiry date in MM/YY format.'
      },
      cvv: {
          element: document.getElementById('cvv'),
          validate: (value) => /^[0-9]{3,4}$/.test(value),
          error: 'Please enter a valid 3 or 4-digit CVV.'
      },
      cardholderName: {
          element: document.getElementById('cardholder-name'),
          validate: (value) => value.trim() !== '' && /^[a-zA-Z ]+$/.test(value),
          error: 'Please enter the cardholder name.'
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
