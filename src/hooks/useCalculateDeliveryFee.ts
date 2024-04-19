import { getProductWeight } from '@/api/products';
import { CartItem } from '@/types';
import { useEffect, useState } from 'react';



const useCalculateDeliveryFee = (cartProducts: CartItem[], shippingFee: number) => {
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    let totalWeight = 0;

    for (const cartItem of cartProducts) {
      const weight = cartItem.product.product_details?.Weight;
      totalWeight += parseInt(weight || "0", 10);
    }

    const averageWeight = totalWeight / cartProducts.length;
    setDeliveryFee(averageWeight * shippingFee);
  }, [cartProducts, shippingFee]);

  return deliveryFee;
};

export default useCalculateDeliveryFee;
