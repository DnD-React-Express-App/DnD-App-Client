import API from '../api/axios';

// Log in a user
export const login = (email, password) => {
  return API.post('/auth/login', { email, password });
};
// Sign up a new user
export const signup = ({ email, name, password }) => {
  return API.post('/auth/signup', { email, name, password });
};
// Verify if the stored token is still valid
export const verify = () => {
  return API.get('/auth/verify');
};
