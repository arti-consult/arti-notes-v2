

export async function getFolders() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getFolders:', err);
    return [];
  }
}

export async function createFolder(name: string) {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Mappenavn kan ikke være tomt');
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Bruker ikke logget inn');
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name: trimmedName,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('En mappe med dette navnet eksisterer allerede');
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error in createFolder:', err);
    throw err;
  }
}

export async function updateFolder(id: string, name: string) {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Mappenavn kan ikke være tomt');
    }

    const { data, error } = await supabase
      .from('folders')
      .update({
        name: trimmedName,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('En mappe med dette navnet eksisterer allerede');
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error in updateFolder:', err);
    throw err;
  }
}

export async function deleteFolder(id: string) {
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Error in deleteFolder:', err);
    throw err;
  }
}