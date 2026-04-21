export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const login = () => {
  localStorage.setItem("token", "login-success");
};

export const logout = () => {
  localStorage.removeItem("token");
};
