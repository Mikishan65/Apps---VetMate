import React, { createContext, useState, useContext } from 'react';

// Crear el Contexto
const FavoritesContext = createContext();

// Crear un Hook personalizado para facilitar el uso del contexto
export const useFavorites = () => useContext(FavoritesContext);

// Crear el Provider del contexto
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (receta) => {
    if (!favorites.find((fav) => fav.id === receta.id)) {
      setFavorites([...favorites, receta]);
    }
  };

  const removeFavorite = (recetaId) => {
    setFavorites(favorites.filter((receta) => receta.id !== recetaId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
