import React, { createContext, useState, useEffect } from 'react';
import { getSpells, createSpell, updateSpell, deleteSpell } from '../services/spell.service';

export const SpellContext = createContext();

export const SpellProviderWrapper = ({ children }) => {
  const [spells, setSpells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpells();
  }, []);

  const loadSpells = () => {
    setIsLoading(true);
    getSpells()
      .then(res => {
        setSpells(res.data);
      })
      .catch(err => {
        console.error('Failed to load spells:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addSpellToContext = async (spellData) => {
    const res = await createSpell(spellData);
    setSpells(prev => [...prev, res.data]);
    return res.data;
  };

  const updateSpellInContext = async (id, data) => {
    const res = await updateSpell(id, data);
    setSpells(prev => prev.map(spell => spell._id === id ? res.data : spell));
    return res.data;
  };

  const deleteSpellFromContext = async (id) => {
    await deleteSpell(id);
    setSpells(prev => prev.filter(spell => spell._id !== id));
  };

  return (
    <SpellContext.Provider value={{
      spells,
      isLoading,
      error,
      addSpell: addSpellToContext,
      updateSpell: updateSpellInContext,
      deleteSpell: deleteSpellFromContext,
      reloadSpells: loadSpells
    }}>
      {children}
    </SpellContext.Provider>
  );
};
