import API from '../api/axios';

export const updateUser = (id, data) => {
  return API.put(`/users/${id}`, data);
};