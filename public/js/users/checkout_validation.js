import validation from "../validation/validation.js";

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorsDiv.innerHTML = "";
    let errors = [];

     function validateZipCode(value, fieldName) {
        const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
        if (!zipCodePattern.test(value)) {
          throw `${fieldName} is invalid. Please provide a valid ZIP code.`;
        }
        return value.trim();
      }
  
    try {
      fullNameInput.value = validation.validateString(
        fullNameInput.value,
        "Full Name",
        false
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    try {
      addressInput.value = validation.validateString(
        addressInput.value,
        "Street Address",
        false
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    try {
      cityInput.value = validation.validateString(
        cityInput.value,
        "City",
        false
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    try {
      stateInput.value = validation.validateString(
        stateInput.value,
        "State",
        false
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    try {
      zipCodeInput.value = validateZipCode(
        zipCodeInput.value,
        "ZIP Code"
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    try {
      countryInput.value = validation.validateString(
        countryInput.value,
        "Country",
        false
      );
    } catch (e) {
      errors = errors.concat(e);
    }
  
    if (errors.length !== 0) {
      for (const error of errors) {
        const pItem = document.createElement("p");
        pItem.textContent = error;
        pItem.style.color = "red";
        errorsDiv.appendChild(pItem);
      }
    } else {
      window.location.href = "/payment";
    }
  });
  