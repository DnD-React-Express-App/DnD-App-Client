import React, { useState, useEffect } from "react";
import { getItems, createItem, deleteItem, updateItem } from '../services/item.service';

export const ItemContext = React.createContext();

export function ItemProviderWrapper({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    setIsLoading(true);
    getItems()
      .then(res => {
        setItems(res.data);
      })
      .catch(err => {
        console.error('Failed to load items:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addItemToContext = async (itemData) => {
    const res = await createItem(itemData);
    setItems(prev => [...prev, res.data]);
    return res.data;
  };

  const updateItemInContext = async (id, data) => {
    const res = await updateItem(id, data);
    setItems(prev => prev.map(item => item._id === id ? res.data : item));
    return res.data;
  };

  const deleteItemFromContext = async (id) => {
    await deleteItem(id);
    setItems(prev => prev.filter(item => item._id !== id));
  };
  

  return (
    <ItemContext.Provider value={{
      items,
      isLoading,
      addItem: addItemToContext,
      updateItem: updateItemInContext,
      deleteItem: deleteItemFromContext,
      reloadItems: loadItems
    }}>
      {children}
    </ItemContext.Provider>
  );
}
