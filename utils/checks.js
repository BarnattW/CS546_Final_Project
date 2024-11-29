import { ObjectId } from "mongodb";

const checkExists = (val) => {
	if (val === null || val === undefined)
		throw `Err: Argument ${val} is null or undefined`;
};

const checkIsString = (str) => {
	checkExists(str);
	if (typeof str != "string") throw `Err: Argument ${str} should be a string`;
};

const checkIsStringEmpty = (str) => {
	if (str.trim().length <= 0)
		throw "Err: String argument cannot be an empty string or empty spaces";
};

const checkString = (str) => {
	checkIsString(str);
	checkIsStringEmpty(str);
	//if (!isNaN(str)) throw `Err: Argument ${str} should not contain only digits`;
	return str.trim();
};

const checkId = (id) => {
	id = checkString(id);
	if (!ObjectId.isValid(id)) throw "Err: invalid object ID";
	return id;
};

export { checkString, checkId };
