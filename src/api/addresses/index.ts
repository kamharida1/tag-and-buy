import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/UserProvider';
import { InsertTables, Tables, UpdateTables } from '@/types';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export const useAdminAddressList = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    //refetchOnWindowFocus: false,
  });
}

export const useGetSelectedAddress = () => { 
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['addresses', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_selected', true)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    //refetchOnWindowFocus: false,
  });   
}

export const useAddress = (id: string) => { 
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
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

export const useMyAddressList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['addresses', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    //refetchOnWindowFocus: false,
  });
};

export const useInsertAddress = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'addresses'>) {
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
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
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

  return useMutation({
    async mutationFn({
      id,
      updatedFields
    }: {
      id: string;
      updatedFields: UpdateTables<'addresses'>;
      }) {
      await supabase.from("addresses").update({ is_selected: false });
      const { error, data: updatedAddress } = await supabase
        .from('addresses')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedAddress;
    },
    async onSuccess(_, { id, updatedFields }) {
      await queryClient.invalidateQueries({queryKey: ['addresses']});
      await queryClient.invalidateQueries({queryKey: ['addresses', id]});
      await queryClient.setQueryData(['addresses', id], (oldData: any) => { 
        oldData ? {...oldData, updatedFields} : oldData 
      })
    },
  });
};


export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: string) {
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