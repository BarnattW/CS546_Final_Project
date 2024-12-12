import validation from "../validation/validation.js";

let signupForm = document.getElementById("signup-form");
let firstNameInput = document.getElementById("first-name");
let lastNameInput = document.getElementById("last-name");
let usernameInput = document.getElementById("user-name");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("confirmPassword");
let errorsDiv = document.getElementById("form-errors-div");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  errorsDiv.innerHTML = "";
  let errors = [];

  try {
    firstNameInput.value = validation.validateString(
      firstNameInput.value,
      "First name",
      false
    );
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    lastNameInput.value = validation.validateString(
      lastNameInput.value,
      "Last name",
      false
    );
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    usernameInput.value = validation.validateUsername(
      usernameInput.value,
      "Username"
    );
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    validation.validatePassword(passwordInput.value, "Password");
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    if (passwordInput.value !== confirmPasswordInput.value) {
      throw "Passwords do not match!";
    }
  } catch (e) {
    errors.push(e);
  }

  if (errors.length !== 0) {
    for (const error of errors) {
      const pItem = document.createElement("p");
      pItem.textContent = error;
      errorsDiv.appendChild(pItem);
    }
  } else {
    signupForm.submit();
  }
});
