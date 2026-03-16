import { supabase } from "../lib/supabase";

export const mekanikService = {
  // Fetch all mechanics
  getAll: async () => {
    const { data, error } = await supabase
      .from('mechanics')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Create new mechanic
  create: async (formData) => {
    const { data, error } = await supabase
      .from('mechanics')
      .insert([formData]);
    if (error) throw error;
    return data;
  },

  // Update mechanic
  update: async (id, formData) => {
    const { data, error } = await supabase
      .from('mechanics')
      .update(formData)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // Delete mechanic
  delete: async (id) => {
    const { error } = await supabase
      .from('mechanics')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
