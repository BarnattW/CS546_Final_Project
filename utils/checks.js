import { ObjectId } from 'mongodb';
import xss from 'xss';

const checkExists = (val) => {
  if (val === null || val === undefined)
    throw `Err: Argument ${val} is null or undefined`;
};

const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
};

const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

const checkIsNumber = (num) => {
  checkExists(num);
  if (typeof num != 'number') throw `Err: Argument ${num} should be a number`;
};

const checkIsInteger = (num) => {
  if (!Number.isInteger(num)) throw `Err: Number ${num} should be an integer`;
};

const checkIsPositiveInteger = (num) => {
  checkIsNumber(num);
  checkIsInteger(num);
  if (num < 0) throw 'Err: Number should be greater than 0';
};

const checkDate = (date) => {
  if (date instanceof Date === false && isNaN(num))
    throw `Err: ${date} is not a valid date`;
};

const checkCustomer = (username, password, name) => {
  username = checkString(username);
  password = checkString(password);
  name = checkString(name);

  return { username: username, password: password, name: name };
};

const sanitizeInput = (arg) => {
  arg = xss(arg);
  return arg;
};

const sanitizeObject = (obj) => {
  for (const property in obj) {
		obj[property] = xss(obj[property]);
	}
  return obj;
};

const checkStringLength = (str, min, max) => {
	if (max == undefined && str.length < min) {
		throw `Err: Input string should be greater than ${min} characters long`;
	}
	if (str.length < min || str.length > max)
		throw `Err: Input string should be between ${min}-${max} characters long`;
};

export {
	checkString,
	checkId,
	checkIsPositiveInteger,
	checkCustomer,
	sanitizeInput,
	sanitizeObject,
	checkStringLength,
	checkDate,
};
