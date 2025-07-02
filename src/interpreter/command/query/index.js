import Script from '@/hook/Script';

const Query = (id, isOne = false, obj = null) => {
  const result = Script({ id }).val;
  if (isOne) {
    return result && result.length > 0 ? result[0][obj].toString() : null;
  }
  return result;
};

export default Query;
