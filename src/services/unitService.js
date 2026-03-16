import { supabase } from "../lib/supabase";

export const unitService = {
  // Fetch all units
  getAll: async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Create new unit
  create: async (formData) => {
    const { data, error } = await supabase
      .from('units')
      .insert([formData]);
    if (error) throw error;
    return data;
  },

  // Update unit
  update: async (id, formData) => {
    const { data, error } = await supabase
      .from('units')
      .update(formData)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // Delete unit
  delete: async (id) => {
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
