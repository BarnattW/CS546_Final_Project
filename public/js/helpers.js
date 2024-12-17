/*
 * Helpers
 */
export const checkInputEmpty = (elementId, inputName) => {
	if (!elementId.value.trim()) throw `${inputName} cannot be empty`;
	return elementId.value.trim();
};

export const checkInputLength = (elementId, inputName, min, max) => {
	const str = elementId.value;
	if (max == undefined && str.length < min) {
		throw `${inputName} should be greater than ${min} characters long`;
	}
	if (str.length < min || str.length > max)
		throw `${inputName} should be between ${min}-${max} characters long`;
};

export const convertImage = (image) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = () => resolve(fileReader.result);
		fileReader.onerror = (error) => reject(error);
		fileReader.readAsDataURL(image);
	});
};

export const checkNumRange = (num, min, max) => {
	if (num < min || num > max) throw `${num} is not in the range ${min}-${max}`;
};

const errorDialog = document.getElementById("errorDialog");
export const showErrorDialog = (message) => {
	const errorMessageElement = document.getElementById("errorMessage");
	if (errorMessageElement) errorMessageElement.textContent = message;

	errorDialog.style.display = "flex";
};

const closeErrorDialog = document.getElementById("errorDialogClose");
if (closeErrorDialog)
	closeErrorDialog.addEventListener("click", () => {
		errorDialog.style.display = "none";
	});
