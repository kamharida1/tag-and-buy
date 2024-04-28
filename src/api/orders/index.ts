import { generateOrderNumber } from '@/helpers/generateOrderNo';
import { InsertTables, Tables, UpdateTables } from '@/types';
import { supabaseClient } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Preparing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMyOrderList = () => {
  const {userId, getToken } = useAuth();

  return useQuery({
    queryKey: ['orders', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const {userId, getToken } = useAuth();

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { error, data: newOrder } = await supabase
        .from('orders')
        .insert({
          ...data,
          user_id: userId,
          order_no: generateOrderNumber(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({queryKey: ['orders']});
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: UpdateTables<'orders'>;
      }) {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({queryKey: ['orders']});
      await queryClient.invalidateQueries({queryKey: ['orders', id]});
    },
  });
};