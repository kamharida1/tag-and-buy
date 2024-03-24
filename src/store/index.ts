import { CartItem, Product } from '@/types';
import { create } from 'zustand';
import * as SecureStore from "expo-secure-store";
import { useEffect } from 'react';


type CartStore = {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, quantity:number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, newQuantity: -1 | 1) => void;
  clearCart: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
};

const CART_STORAGE_KEY = "cartItems";

const saveItemsToStorage = (updatedItems: CartItem[]) => {
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(updatedItems));
  };

const loadItemsFromStorage = async () => {
  const storedItems = await SecureStore.getItemAsync(CART_STORAGE_KEY);
  return storedItems ? JSON.parse(storedItems) : [];
};


const FAVORITES_STORAGE_KEY = "favoriteItems";

const saveFavoritesToStorage = (updatedFavorites: Product[]) => {
  SecureStore.setItemAsync(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
};

const loadFavoritesFromStorage = async () => {
  const storedFavorites = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

const useCartStore = create<CartStore>(set => ({
  cart: [],
  favorites: [],
  avgShppingCost: 0,
  shippingCost: 0,
  total: 0,
  checkOut: () =>{},
  addToCart: (product, quantity) => {
    set(state => {
      if (!state.cart.some(item => item.product.id === product.id)) {
        return {
          cart: [
            ...state.cart,
            {
              product,
              quantity,
            },
          ],
        };
      }
      saveItemsToStorage(state.cart);
      return state;

    });
  },
  removeFromCart: (productId: string) => {
    set(state => {
      const newCart = state.cart.filter(item => item.product.id !== productId);
      saveItemsToStorage(newCart);
      return { cart: newCart };
    });
  },
  updateCartItemQuantity: (productId, newQuantity: -1 | 1) => {
    set(state => {
      const newCart = state.cart.map(item =>
        item.product.id === productId ? {...item, quantity: item.quantity + newQuantity} : item
      ).filter(item => item.quantity > 0);
      saveItemsToStorage(newCart);
      return { cart: newCart };
    });
  },
  clearCart: () => {
    SecureStore.deleteItemAsync(CART_STORAGE_KEY);
    set({cart: []});
  },
  addToFavorites: product => {
      set(state => {
        let newFavorites;
        if (!state.favorites.some(fav => fav.id === product.id)) {
          newFavorites = [...state.favorites, product];
        } else {
          newFavorites = state.favorites;
        }
        saveFavoritesToStorage(newFavorites);
        return { favorites: newFavorites };
      });
    },
  removeFromFavorites: productId => {
    set(state => {
      const newFavorites = state.favorites.filter(product => product.id !== productId);
      saveFavoritesToStorage(newFavorites);
      return { favorites: newFavorites };
    });
  },
}));

// Load cart items and favorites from storage when store is created
useEffect(() => {
  const loadItems = async () => {
    const storedItems = await loadItemsFromStorage();
    const storedFavorites = await loadFavoritesFromStorage();
    useCartStore.setState({ cart: storedItems, favorites: storedFavorites });
  };
  loadItems();
}, []);

export {useCartStore};