import validation from "../validation/validation.js";
let loginForm = document.getElementById("login-form");
let usernameInput = document.getElementById("user-name");
let passwordInput = document.getElementById("password");
let errorsDiv = document.getElementById("form-errors-div");

// checking the inputs in login form
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  errorsDiv.innerHTML = "";
  let errors = [];
  try {
    usernameInput.value = validation.validateUsername(
      usernameInput.value,
      "Username"
    );
  } catch (e) {
    errors = errors.concat(e);
  }
  try {
    validation.validateLoginPassword(passwordInput.value, "Password");
  } catch (e) {
    errors = errors.concat(e);
  }
  if (errors.length !== 0) {
    for (const error of errors) {
      const pItem = document.createElement("p");
      pItem.textContent = error;
      errorsDiv.appendChild(pItem);
    }
  } else {
    loginForm.submit();
  }
});

