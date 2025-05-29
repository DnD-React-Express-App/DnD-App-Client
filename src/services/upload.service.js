import API from '../api/axios';

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
