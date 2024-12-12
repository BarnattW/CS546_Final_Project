import validation from "../validation/validation.js";

let addListingForm = document.getElementById("addListingForm");
let itemNameInput = document.getElementById("itemName");
let itemDescriptionInput = document.getElementById("itemDescription");
let itemPriceInput = document.getElementById("itemPrice");
let errorsDiv = document.getElementById("form-errors-div");

// Checking the inputs in the Add Listing form
addListingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  errorsDiv.innerHTML = "";
  let errors = [];

  try {
    itemNameInput.value = validation.validateItemName(
      itemNameInput.value,
      "Item Name"
    );
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    itemDescriptionInput.value = validation.validateItemDescription(
      itemDescriptionInput.value,
      "Item Description"
    );
  } catch (e) {
    errors = errors.concat(e);
  }

  try {
    itemPriceInput.value = validation.validateItemPrice(
      itemPriceInput.value,
      "Item Price"
    );
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
    addListingForm.submit();
  }
});
