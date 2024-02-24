import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { UpdateTables, InsertTables } from '@/types';
import { useAuth } from '@/providers/UserProvider';
import { Tables } from '@/database.types';

export const useFetchReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', { productId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId);
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useFetchUserReview = (userReviewID: string) => {
  return useQuery({
    queryKey: ['users', { userReviewID }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userReviewID)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: true,
  });
}


export const useReview = (id: string) => { 
  return useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertReview = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'reviews'>) {
      const { error, data: newReview } = await supabase
        .from('reviews')
        .insert({ ...data, profile_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newReview;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({queryKey: ['reviews']});
    },
  });
};

export const useUpdateReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields
    }: {
      id: string;
      updatedFields: UpdateTables<'reviews'>;
      }) {
      const { error, data: updatedReviews } = await supabase
        .from('reviews')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedReviews;
    },
    async onSuccess(_, { id, updatedFields }) {
      await queryClient.invalidateQueries({queryKey: ['reviews']});
      await queryClient.invalidateQueries({queryKey: ['reviews', id]});
      await queryClient.setQueryData(['reviews', id], (oldData: any) => { 
        oldData ? {...oldData, updatedFields} : oldData 
      })
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: string) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}