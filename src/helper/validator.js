import CActionType from '@/constant/CActionType';

const required = (value) => {
  return !value;
};

const specialCharacter = (value) => {
  return !!value.match(/[^a-zA-Z0-9]+/);
};

const startNumeric = (value) => {
  return !!value.match(/^[0-9]/);
};

const fieldName = (value) => {
  return !value.match(/^[a-zA-Z][a-zA-Z0-9_]*$/);
};

const same = (items, value) => {
  return !!items.find((item) => item === value);
};

const generateValidation = (action, key, value, rule) => {
  const regex = new RegExp(`${key}:\\(([^)]*)\\)`);
  const matchValue = rule.match(regex);

  if (action === 1 && !matchValue) return `${rule}|${key}:(${value})`;

  let newRule = '';
  const values = matchValue?.[1].split(',').map((value) => value.trim()) || [];

  if (action === CActionType.insert.value) {
    values.push(value);
    newRule = `${key}:(${values.join(',')})`;
  }

  if (action === CActionType.delete.value) {
    newRule = '';
    const indexToRemove = values.indexOf(value);

    if (indexToRemove !== -1) values.splice(indexToRemove, 1);

    if (values.length === 1) {
      newRule = `${key}:(${values[0]})`;
    } else if (values.length > 1) {
      newRule = `${key}:(${values.join(',')})`;
    } else {
      newRule = '';
    }
  }
  return rule.replace(regex, newRule);
};

const validator = (rules, value) => {
  if (!rules) return false;

  const rulesSplited = rules.split('|');
  const error = {
    status: false,
    message: '',
  };

  for (let index = 0; index < rulesSplited.length; index++) {
    const rule = rulesSplited[index];

    if (!rule) continue;

    if (rule === 'required' && required(value)) {
      error.status = true;
      error.message = 'Can not be empty';
      break;
    }

    if (rule === 'special_character' && specialCharacter(value)) {
      error.status = true;
      error.message = 'Must not contain special characters';
      break;
    }

    if (rule === 'start_numeric' && startNumeric(value)) {
      error.status = true;
      error.message = 'Must not start with a number';
      break;
    }

    if (rule === 'field_name' && fieldName(value)) {
      error.status = true;
      error.message = 'Name is invalid';
      break;
    }

    const sameValidate = rule.match(/same:\(([^)]+)\)/);
    if (sameValidate && same(sameValidate[1].split(','), value)) {
      error.status = true;
      error.message = 'Already exist';
      break;
    }
  }

  return error;
};

export { validator, generateValidation };
