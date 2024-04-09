import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';


// Lista original de recetas
const recetasOriginales = [
  { nombre: "Pollo a la parrilla", id: "1", imagen: require('../../assets/receta1.jpg') },
  { nombre: "Ensalada César", id: "2", imagen: require('../../assets/receta2.webp') },
  { nombre: "Sopa de tomate", id: "3", imagen: require('../../assets/receta3.jpg') },
  { nombre: "Lasagna de carne", id: "4", imagen: require('../../assets/receta4.jpg') },
  { nombre: "Tacos de pescado", id: "5", imagen: require('../../assets/receta5.webp') },
  { nombre: "Pastel de chocolate", id: "6", imagen: require('../../assets/receta6.jpg') },
];

// Lista modificada de recetas
const recetasActualizadas = [
  { nombre: "Pizza margarita", id: "7", imagen: require('../../assets/receta1.jpg') },
  { nombre: "Hamburguesa", id: "8", imagen: require('../../assets/receta2.webp') },
  { nombre: "Ensalada de frutas", id: "9", imagen: require('../../assets/receta3.jpg') },
  { nombre: "Pasta Alfredo", id: "10", imagen: require('../../assets/receta4.jpg') },
  { nombre: "Sushi de salmón", id: "11", imagen: require('../../assets/receta5.webp') },
  { nombre: "Cheesecake de fresa", id: "12", imagen: require('../../assets/receta6.jpg') },
];

const HomeScreen = ({ navigation}) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [recetas, setRecetas] = useState(recetasOriginales); // Inicialmente se cargan las recetas originales
  const [mostrandoOriginales, setMostrandoOriginales] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState('');

  const esFavorito = (id) => {
    return favorites.some((receta) => receta.id === id);
  };

  const manejarFavorito = (receta) => {
    if (esFavorito(receta.id)) {
      removeFavorite(receta.id);
    } else {
      addFavorite(receta);
    }
  };
  
  // Actualiza las recetas con las originales o las actualizadas y las filtra si es necesario
  const actualizarRecetas = () => {
    const nuevasRecetas = mostrandoOriginales ? recetasActualizadas : recetasOriginales;
    setRecetas(nuevasRecetas);
    setMostrandoOriginales(!mostrandoOriginales);
    filtrarRecetas(textoBusqueda, nuevasRecetas);
  };

  // Filtra las recetas basadas en el texto de búsqueda proporcionado
  const filtrarRecetas = (texto, listaRecetas = undefined) => {
    const listaParaFiltrar = listaRecetas || (mostrandoOriginales ? recetasOriginales : recetasActualizadas);
    const recetasFiltradas = texto ? 
      listaParaFiltrar.filter(receta => receta.nombre.toLowerCase().includes(texto.toLowerCase())) : 
      listaParaFiltrar;
    setRecetas(recetasFiltradas);
    setTextoBusqueda(texto);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={actualizarRecetas} style={styles.refreshButton}>
          <FontAwesome name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar recetas..."
          value={textoBusqueda}
          onChangeText={(texto) => filtrarRecetas(texto)} // Usa filtrarRecetas para actualizar la búsqueda
        />
      </View>

      <FlatList
        data={recetas}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Detalles', {
              recetaId: item.id,
              recetaNombre: item.nombre,
              recetaImagen: item.imagen,
            })}>
              <View style={styles.card}>
                <Image source={item.imagen} style={styles.image} />
                <Text style={styles.item}>{item.nombre}</Text>
                <TouchableOpacity
                  style={styles.favoritoButton}
                  onPress={() => manejarFavorito(item)}>
                  <FontAwesome name={esFavorito(item.id) ? "heart" : "heart-o"} size={24} color={esFavorito(item.id) ? "red" : "grey"} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 25 : 0, // Ajuste adicional para Android
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
  },
  favoritoButton: {
    position: 'absolute',
    right: 10,
    top: 10, // Posición del botón de favorito
  },
  refreshButton: {
    backgroundColor: '#ddd', // Fondo ligeramente gris para el botón
    padding: 10,
    borderRadius: 20,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },  
  cardContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS y su configuración
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 100, // Ajustar según necesidad
    height: 100, // Ajustar según necesidad
    borderRadius: 50, // Hace la imagen circular
    marginBottom: 8,
  },
  item: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;