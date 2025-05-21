import API from '../api/axios';

// Create a new item
export const createItem = (itemData) => {
  return API.post('/items', itemData);
};

// Get all items
export const getItems = () => {
  return API.get('/items');
};

// Get one item by ID
export const getItemById = (id) => {
  return API.get(`/items/${id}`);
};

// Delete an item
export const deleteItem = (id) => {
  return API.delete(`/items/${id}`);
};

// Update an item
export const updateItem = (id, data) => {
  return API.put(`/items/${id}`, data);
};
