import Builder from '../command/builder';
import Core from '../command/core';
import Query from '../command/query';

const Waiter = (props) => {
  const { isBuilder } = props;

  const ZCore = Core();
  const ZBuilder = Builder();
  const ZQuery = Query();

  // eslint-disable-next-line no-unused-vars
  const order = (func, param = null) => {
    try {
      eval(func);
    } catch (error) {
      console.log(`Error : ${error.message}`);
      return;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const take = (data, param = null) => {
    if (!data) return null;
    try {
      if (typeof data === 'object') {
        if (!data.isBind) return data.value;
        return data.value ? eval(data.value) : null;
      }
      return data ? eval(data) : null;
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  return { order, take };
};

export default Waiter;
