import { useComponent } from '@/context/ComponentProvider';

const Comp = () => {
  const { comp, setComp } = useComponent({});

  const removeAll = () => {
    setComp(null);
  };

  const setAll = (obj) => {
    setComp(obj);
  };

  const set = (name, value) => {
    const newComp = { ...comp };
    newComp[name] = value;
    setComp(newComp);
  };

  const get = (name) => {
    return comp ? comp[name] : null;
  };

  return {
    get,
    removeAll,
    set,
    setAll,
  };
};

export default Comp;
