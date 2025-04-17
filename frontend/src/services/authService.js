import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/';

const register = async (email, password, fullName, role) => {
  const response = await axios.post(API_URL + 'register', {
    email,
    password,
    full_name: fullName,
    role
  });
  return response.data;
};

const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await axios.post(API_URL + 'token', formData);
  
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;