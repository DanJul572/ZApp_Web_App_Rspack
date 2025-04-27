import { useVars } from '@/context/VarsProvider';

const Vars = () => {
  const { vars, setVars } = useVars({});

  const removeAll = () => {
    setVars(null);
  };

  const set = (name, value) => {
    const newVars = { ...vars };
    newVars[name] = value;
    setVars(newVars);
  };

  const setAll = (obj) => {
    setVars(obj);
  };

  const get = (name) => {
    return vars?.[name] ? vars[name] : null;
  };

  const getAll = () => {
    return vars;
  };

  return {
    get,
    getAll,
    removeAll,
    set,
    setAll,
  };
};

export default Vars;
