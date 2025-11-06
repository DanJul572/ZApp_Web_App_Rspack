import CryptoJS from 'crypto-js';

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_ENCRYPTION_KEY,
  ).toString();
};

export const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(
    data,
    process.env.REACT_APP_ENCRYPTION_KEY,
  );
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
