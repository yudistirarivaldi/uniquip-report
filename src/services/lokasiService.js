import { supabase } from "../lib/supabase";

export const lokasiService = {
  // Fetch all locations
  getAll: async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Insert a new location
  create: async (formData) => {
    const { data, error } = await supabase
      .from('locations')
      .insert([formData]);
    if (error) throw error;
    return data;
  },

  // Update an existing location
  update: async (id, formData) => {
    const { data, error } = await supabase
      .from('locations')
      .update(formData)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // Delete a location
  delete: async (id) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
