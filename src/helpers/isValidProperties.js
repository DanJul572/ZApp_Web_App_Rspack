import EValidProperty from '@/enums/EValidProperty';

const isValidProperties = (name, group, type) => {
  if (!name || !group || !type) {
    return false;
  }

  const validate = EValidProperty[name];

  if (!validate || !validate[group]) {
    return false;
  }

  if (Array.isArray(validate[group])) {
    return validate[group].includes(type);
  }

  return validate[group];
};

export default isValidProperties;
