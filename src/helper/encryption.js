import CryptoJS from 'crypto-js';

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), 'your key is here').toString();
};

export const decrypt = (data) => {
  var bytes = CryptoJS.AES.decrypt(data, 'your key is here');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
