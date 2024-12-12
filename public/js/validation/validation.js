export const usernamePolicies = [
    { regex: /^[^ ]{6,}$/, error: "Username must have at least six characters!" },
  ];
  
  export const passwordPolicies = [
    { regex: /.{8}/, error: "Password must have at least eight characters!" },
    { regex: /[a-z]{1}/, error: "Password must have at least one lowercase character!" },
    { regex: /[A-Z]{1}/, error: "Password must have at least one uppercase character!" },
    { regex: /[0-9]{1}/, error: "Password must have at least one numeric character!" },
    { regex: /[^a-zA-Z0-9]/, error: "Password must have at least one special character!" },
  ];
  
  const validateString = (str, varName, checkObjectId) => {
    if (str == undefined) {
      throw [`Expected ${varName || ""} to be of type string, but it is not provided!`];
    }
    if (str == null) {
      throw [`Expected ${varName || ""} to be of type string, but it is null!`];
    }
    if (Array.isArray(str)) {
      throw [`Expected ${varName || ""} to be of type string, but it is an array!`];
    }
    if (typeof str !== "string") {
      throw [`Expected ${varName || ""} to be of type string, but it is of type ${typeof str}!`];
    }
    const trimmedStr = str.trim();
    if (trimmedStr.length === 0) {
      throw [`String ${varName || ""} is empty or has only spaces!`];
    }
    if (checkObjectId && !ObjectId.isValid(trimmedStr)) {
      throw [`String (${trimmedStr}) is not a valid ObjectId!`];
    }
    return trimmedStr;
  };
  
  const validateLoginPassword = (str, varName) => {
    validateString(str, varName);
  };
  
  function validateUsername(str, varName) {
    let errors = [];
    try {
      str = validateString(str, varName);
    } catch (e) {
      errors = errors.concat(e);
    }
  
    for (const policy of usernamePolicies) {
      if (!policy.regex.test(str)) {
        errors = errors.concat(policy.error);
      }
    }
  
    if (errors.length !== 0) {
      throw errors;
    }
  
    return str.toLowerCase();
  }
  
  function validatePassword(str, varName) {
    let errors = [];
    validateString(str, varName);
  
    for (const policy of passwordPolicies) {
      if (!policy.regex.test(str)) {
        errors = errors.concat(policy.error);
      }
    }
  
    if (errors.length !== 0) {
      throw errors;
    }
  }
  
  function validateBoolean(bool, varName) {
    if (typeof bool !== "boolean") {
      throw [`Variable (${varName || ""}) is not of type boolean!`];
    }
  }
  
  function validateNumber(num, varName) {
    if (typeof num !== "number" || isNaN(num)) {
      throw [`${varName || ""} is not a valid number`];
    }
  }

  
  export default {
    validateString,
    validateUsername,
    validatePassword,
    validateLoginPassword,
    validateBoolean,
    validateNumber,
  };
  