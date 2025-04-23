const logout = () => {
  localStorage.removeItem('tree');
  localStorage.removeItem('token');
};

const auth = {
  logout: logout,
};

export default auth;
