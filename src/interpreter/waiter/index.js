import Builder from '../command/builder';
import Core from '../command/core';
import Query from '../command/query';

const Waiter = () => {
  // biome-ignore lint/correctness/noUnusedVariables: required for interpeter
  const zcore = Core();

  // biome-ignore lint/correctness/noUnusedVariables: required for interpeter
  const zbuilder = Builder();

  // biome-ignore lint/correctness/noUnusedVariables: required for interpeter
  const zquery = Query();

  // biome-ignore lint/correctness/noUnusedFunctionParameters: required for interpeter
  const order = (func, param = null) => {
    try {
      eval(func);
    } catch (error) {
      console.log(`Error : ${error.message}`);
      return;
    }
  };

  // biome-ignore lint/correctness/noUnusedFunctionParameters: required for interpeter
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
