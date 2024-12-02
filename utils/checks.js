import { ObjectId } from 'mongodb';
import xss from 'xss';

const checkExists = (val) => {
  if (val === null || val === undefined)
    throw `Err: Argument ${val} is null or undefined`;
};

const checkIsString = (str) => {
  checkExists(str);
  if (typeof str != 'string') throw `Err: Argument ${str} should be a string`;
};

const checkIsStringEmpty = (str) => {
  if (str.trim().length <= 0)
    throw 'Err: String argument cannot be an empty string or empty spaces';
};

const checkString = (str) => {
  checkIsString(str);
  checkIsStringEmpty(str);
  //if (!isNaN(str)) throw `Err: Argument ${str} should not contain only digits`;
  return str.trim();
};

const checkId = (id) => {
  id = checkString(id);
  if (!ObjectId.isValid(id)) throw 'Err: invalid object ID';
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
  for (property in obj) {
    obj[property] = xss(obj[property]);
  }
  return obj;
};
export {
  checkString,
  checkId,
  checkIsPositiveInteger,
  checkCustomer,
  sanitizeInput,
  sanitizeObject,
};
