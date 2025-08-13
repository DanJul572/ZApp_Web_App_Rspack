import Builder from '../command/builder';
import Core from '../command/core';
import Query from '../command/query';

const Waiter = () => {
  const ZCore = Core();
  const ZBuilder = Builder();
  const ZQuery = Query();

  const order = (func, param = null) => {
    try {
      eval(func);
    } catch (error) {
      console.log(`Error : ${error.message}`);
      return;
    }
  };

  const take = (data, param = null) => {
    try {
      if (!data) {
        return null;
      }
      if (typeof data === 'object') {
        if (!data.isBind) {
          return data.value;
        }
        if (data.value) {
          return eval(data.value);
        }
        return null;
      }
      if (data) {
        return eval(data);
      }
      return null;
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  return { order, take };
};

export default Waiter;
