import React, { createContext, useState, useEffect } from 'react';
import { getSpells } from '../services/spell.service';

export const SpellContext = createContext();

export const SpellProviderWrapper = ({ children }) => {
  const [spells, setSpells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSpells()
      .then((res) => {
        setSpells(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Failed to load spells');
        setIsLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <SpellContext.Provider value={{ spells, isLoading, error }}>
      {children}
    </SpellContext.Provider>
  );
};
