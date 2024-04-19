import { InsertTables } from '@/types';
import { supabaseClient } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from '@tanstack/react-query';

export const useInsertOrderItems = () => {
  const {getToken, userId } = useAuth();
  return useMutation({
    async mutationFn(items: InsertTables<'order_items'>[]) {
      if (!userId) return null;
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { error, data: newOrderItem } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newOrderItem;
    },
  });
};