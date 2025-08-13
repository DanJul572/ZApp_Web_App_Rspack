import { useFormData } from '@/context/FormDataProvider';

const FormData = () => {
  const { formData, setFormData } = useFormData({});

  const removeAll = () => {
    setFormData(null);
  };

  const set = (name, value) => {
    const newFormData = { ...formData };
    newFormData[name] = value;
    setFormData(newFormData);
  };

  const setAll = (obj) => {
    setFormData(obj);
  };

  const get = (name) => {
    return formData?.[name] ? formData[name] : null;
  };

  const getAll = () => {
    return formData;
  };

  return {
    get,
    getAll,
    removeAll,
    set,
    setAll,
  };
};

export default FormData;
