import validation from "../validation/validation.js";


 function validateCardNumber(value, fieldName) {
    const cardNumberPattern = /^\d{16}$/;
    if (!cardNumberPattern.test(value)) {
      throw `${fieldName} must be a valid 16-digit card number.`;
    }
    return value.trim();
  }
  
   function validateExpiryDate(value, fieldName) {
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    if (!expiryDatePattern.test(value)) {
      throw `${fieldName} must be in MM/YY format.`;
    }
    return value.trim();
  }
  
   function validateCVV(value, fieldName) {
    const cvvPattern = /^\d{3}$/;
    if (!cvvPattern.test(value)) {
      throw `${fieldName} must be a valid 3-digit CVV.`;
    }
    return value.trim();
  }


let paymentForm = document.getElementById("payment-form");
let errorsDiv = document.createElement("div");
errorsDiv.setAttribute("id", "form-errors-div");
paymentForm.parentNode.insertBefore(errorsDiv, paymentForm);

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  errorsDiv.innerHTML = "";
  let errors = [];

  const cardNumber = document.getElementById("card-number");
  const expiryDate = document.getElementById("expiry-date");
  const cvv = document.getElementById("cvv");

  try {
    validateCardNumber(cardNumber.value, "Card Number");
  } catch (e) {
    errors.push(e);
  }

  try {
    validateExpiryDate(expiryDate.value, "Expiry Date");
  } catch (e) {
    errors.push(e);
  }

  try {
    validateCVV(cvv.value, "CVV");
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      const p = document.createElement("p");
      p.textContent = error;
      p.style.color = "red";
      errorsDiv.appendChild(p);
    }
  } else {
    paymentForm.submit();
  }
});
