import API from '../api/axios';

// Get all spells
export const getSpells = () => {
  return API.get('/spells');
};

// Get one spell by ID
export const getSpellById = (id) => {
  return API.get(`/spells/${id}`);
};

// Create a new spell
export const createSpell = (spellData) => {
  return API.post('/spells', spellData);
};

// Update a spell
export const updateSpell = (id, spellData) => {
  return API.put(`/spells/${id}`, spellData);
};

// Delete a spell
export const deleteSpell = (id) => {
  return API.delete(`/spells/${id}`);
};
