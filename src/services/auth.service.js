import API from '../api/axios';

// Log in a user
export const login = (email, password) => {
  return API.post('/auth/login', { email, password });
};

// Sign up a new user
export const signup = (email, password, name) => {
  return API.post('/auth/signup', { email, password, name });
};

// Verify if the stored token is still valid
export const verify = () => {
  return API.get('/auth/verify');
};
