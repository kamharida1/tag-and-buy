import { CartItem, Product } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartStore = {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, newQuantity: -1 | 1) => void;
  clearCart: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
};

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
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
          return state;
        });
      },
      removeFromCart: (productId: string) => {
        set(state => {
          const newCart = state.cart.filter(item => item.product.id !== productId);
          return { cart: newCart };
        });
      },
      updateCartItemQuantity: (productId, newQuantity: -1 | 1) => {
        set(state => {
          const newCart = state.cart.map(item =>
            item.product.id === productId ? {...item, quantity: item.quantity + newQuantity} : item
          ).filter(item => item.quantity > 0);
          return { cart: newCart };
        });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      addToFavorites: product => {
        set(state => {
          if (!state.favorites.some(fav => fav.id === product.id)) {
            return {
              favorites: [...state.favorites, product],
            };
          }
          return state;
        });
      },
      removeFromFavorites: productId => {
        set(state => ({
          favorites: state.favorites.filter(product => product.id !== productId),
        }));
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => AsyncStorage)
    },
  ),  
);


export {useCartStore};