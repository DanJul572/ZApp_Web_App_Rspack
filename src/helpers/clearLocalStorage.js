const clearLocalStorage = () => {
  localStorage.removeItem('tree');
  localStorage.removeItem('expiredIn');
  localStorage.removeItem('expiredAt');
};

export { clearLocalStorage };
