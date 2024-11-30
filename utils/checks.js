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

const checkIsNumber = (num) => {
	checkExists(num);
	if (typeof num != "number") throw `Err: Argument ${num} should be a number`;
};

const checkIsInteger = (num) => {
	if (!Number.isInteger(num)) throw `Err: Number ${num} should be an integer`;
};

const checkIsPositiveInteger = (num) => {
	checkIsNumber(num);
	checkIsInteger(num);
	if (num < 0) throw "Err: Number should be greater than 0";
};

export { checkString, checkId, checkIsPositiveInteger };
