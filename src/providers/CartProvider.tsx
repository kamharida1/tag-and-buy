import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";
import provinces from '../data/provinces-data'
import * as SecureStore from "expo-secure-store";
import { useGetSelectedAddress, useMyAddressList } from "@/api/addresses";

type Product = Tables<"products">;

type CartType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
  avgShippingCost: number;
  clearCart: () => void;
  deleteItem: (product: Product) => void;
};

const CartContext = createContext<CartType>({
  items: [],
  clearCart: () => {},
  addItem: () => {},
  updateQuantity: () => { },
  deleteItem: () => { },
  total: 0,
  checkout: () => { },
  avgShippingCost: 0,
});

const CART_STORAGE_KEY = "cartItems";
 
const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const [avgShippingCost, setAvgShippingCost] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  const { data: selectedAddress } = useGetSelectedAddress();

  // Load cart items from SecureStore on component mount
  useEffect(() => {
    SecureStore.getItemAsync(CART_STORAGE_KEY).then((storedItems) => {
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    });
  }, []);

  // Use the selected address's 'city' and 'state' to get shipping fee.
  useEffect(() => {
    if (selectedAddress) {
      const city = selectedAddress.city?.toUpperCase() ;
      const state = selectedAddress.state;
      // Find the province and city in ProvinceData.
      const province = provinces.find(
        (province) => province.name === state
      );
      console.log(province);
      if (province) {
        const cityShippingFee = province?.cities[city].shippingFee;
        setShippingFee(cityShippingFee);
      }
    }
   },[selectedAddress])

  console.log("shipping fee", shippingFee);

  const calculateDeliveryFee = (cartProducts: CartItem[]) => {
    let totalWeight = 0;

    if (cartProducts.length > 0) {
      for (const cartItem of cartProducts) {
        totalWeight += parseInt(
          cartItem.product.product_details["Weight"] || "0",
          10
        );
      }

      const averageWeight = totalWeight / cartProducts.length;
      return averageWeight * shippingFee;
    }

    return 0;
  };

  useEffect(() => {
    const cost = calculateDeliveryFee(items);
    setAvgShippingCost(cost);
  }, [items, shippingFee]);

  console.log("avgShippingCost", avgShippingCost);

  const saveItemsToStorage = (updatedItems: CartItem[]) => {
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const addItem = (product: Product) => {
    // if already in cart, increment quantity
    const existingItem = items.find((item) => item.product === product);

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(), // generate
      product,
      product_id: product.id,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
    saveItemsToStorage([newCartItem, ...items]);
  };

  // updateQuantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );

    saveItemsToStorage(items);
  };

  const deleteItem = (product: Product) => { 
    setItems(items.filter((item) => item.product !== product));
    saveItemsToStorage(items.filter((item) => item.product !== product));
  }

  const subTotal = items.reduce((sum, item) => {
    if (item.product && item.product.price !== null) {
      return sum + item.product.price * item.quantity;
    }
    return sum ;
  }, 0);

  const total = subTotal + avgShippingCost; 

  const clearCart = () => {
    setItems([]);
    SecureStore.deleteItemAsync(CART_STORAGE_KEY);
  };

  const checkout = async () => {
    try {
      insertOrder(
        { total, status: "New" },
        {
          onSuccess: (newOrder) => {
            console.log("New order created:", newOrder); // Check if newOrder is valid

            if (newOrder) {
              saveOrderItems(newOrder);
            } else {
              console.error(
                "Error creating order. Returned data is undefined."
              );
            }
          },
        }
      );
    } catch (error) {
      console.error("Error inserting order:", error);
    }
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    console.log("Saving order items for order:", order); // Check if order is valid

    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
    }));

    console.log("Order items:", orderItems); // Check if orderItems are valid

    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/home`);
      },
      onError(error) { 
        console.error("Error inserting order items:", error);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{ items, clearCart, addItem, deleteItem, updateQuantity, total, checkout, avgShippingCost }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
