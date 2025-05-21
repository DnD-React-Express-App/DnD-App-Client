import API from '../api/axios';

// Get all characters for the logged-in user
export const getCharacters = () => {
  return API.get('/api/characters');
};

// Get a single character by ID
export const getCharacterById = (id) => {
  return API.get(`/api/characters/${id}`);
};

// Create a new character
export const createCharacter = (data) => {
  return API.post('/api/characters', data);
};

// Update a character
export const updateCharacter = (id, data) => {
  return API.put(`/api/characters/${id}`, data);
};

// Delete a character
export const deleteCharacter = (id) => {
  return API.delete(`/api/characters/${id}`);
};
