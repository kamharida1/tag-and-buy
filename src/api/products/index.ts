import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
//import { supabase } from '../../lib/supabase';
import { useAuth } from '@clerk/clerk-expo';
import { supabaseClient } from '@/utilities/supabaseClient';



export const useProductList = () => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: string) => { 
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('products')
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

export const useInsertProduct = () => { 
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    async mutationFn(data: any) {
     const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data: product, error } = await supabase
        .from('products')
        .insert(data)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return product;
    },  
      
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    async mutationFn(data: any) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data: product, error } = await supabase
        .from('products')
        .update({
          name: data.name,
          price: data.price,
          description: data.description,
          title: data.title,
          image: data.image,
          images: data.images,
          count: data.count,
          category: data.category,
          brand: data.brand,
          rating: data.rating,
          avg_rating: data.avg_rating,
          product_details: data.product_details,
          sub_category: data.sub_category,
          
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return product;
    },
      
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    async mutationFn(id: string) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}