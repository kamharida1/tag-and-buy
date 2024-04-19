import { InsertTables, Tables, UpdateTables } from '@/types';
import { supabaseClient } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export const useAdminAddressList = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data as Tables<'addresses'>[];
    },
    //refetchOnWindowFocus: false,
  });
}

export const useGetSelectedAddress = () => { 
  const {userId, getToken } = useAuth();

  return useQuery({
    queryKey: ['addresses', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_selected', true)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data as Tables<'addresses'>;
    },
    //refetchOnWindowFocus: false,
  });   
}

export const useAddress = (id: string) => { 
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data as Tables<'addresses'>;
    },
  });
};

export const useMyAddressList = () => {
  const { userId, getToken } = useAuth();

  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      if (!userId) return null;
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data as Tables<'addresses'>[];
    },
    //refetchOnWindowFocus: false,
  });
};

export const useInsertAddress = () => {
  const queryClient = useQueryClient();
  const { userId, getToken } = useAuth();

  return useMutation({
    async mutationFn(data: InsertTables<'addresses'>) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { error, data: newAddress } = await supabase
        .from('addresses')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newAddress;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({queryKey: ['addresses']});
    },
  });
};

export const useEditAddress = () => {
  const queryClient = useQueryClient();
  const { userId, getToken } = useAuth();

  return useMutation({
    async mutationFn(data: any) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { data: address, error } = await supabase
        .from('addresses')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          street: data.street,
          email: data.email,
          street2: data.street2,
          city: data.city,
          user_id: userId,
          state: data.state,
          zip_code: data.zip_code,
          country: data.country,
          phone: data.phone,
          is_selected: data.is_selected,
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return address;
    },
      
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      await queryClient.invalidateQueries({ queryKey: ['addresses', id] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    async mutationFn(data: Tables<'addresses'>[]) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      // await supabase.from("addresses").update({ is_selected: false });
      const { error, data: updatedAddress } = await supabase
        .from('addresses')
        .upsert(data)
        .select()
      if (error) {
        throw new Error(error.message);
      }
      return updatedAddress;
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({queryKey: ['addresses']});
      await queryClient.setQueryData(['addresses', data], (oldData: any) => { 
        oldData ? {...oldData, data} : oldData 
      })
    },
  });
};


export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    async mutationFn(id: string) {
      const token = await getToken({ template: 'supabase'});
      const supabase = await supabaseClient(token);
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}