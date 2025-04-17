

export async function getTags() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error in getTags:', userError);
      return [];
    }

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getTags:', err);
    return [];
  }
}

export async function createTag(name: string) {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Etikettnavnet kan ikke være tomt');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Bruker ikke logget inn');
    }

    const { data, error } = await supabase
      .from('tags')
      .insert({
        name: trimmedName,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('En etikett med dette navnet eksisterer allerede');
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error in createTag:', err);
    throw err;
  }
}

export async function updateTag(id: string, name: string) {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Etikettnavnet kan ikke være tomt');
    }

    const { data, error } = await supabase
      .from('tags')
      .update({
        name: trimmedName,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('En etikett med dette navnet eksisterer allerede');
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error in updateTag:', err);
    throw err;
  }
}

export async function deleteTag(id: string) {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Error in deleteTag:', err);
    throw err;
  }
}

export async function getRecordingTags(recordingId: string) {
  try {
    const { data, error } = await supabase
      .from('recording_tags')
      .select(`
        tag_id,
        tags:tag_id (
          id,
          name
        )
      `)
      .eq('recording_id', recordingId);

    if (error) throw error;

    return (data || []).map(item => item.tags as Tag);
  } catch (err) {
    console.error('Error in getRecordingTags:', err);
    throw err;
  }
}

export async function updateRecordingTags(recordingId: string, tagIds: string[]) {
  try {
    // First delete existing tags
    const { error: deleteError } = await supabase
      .from('recording_tags')
      .delete()
      .eq('recording_id', recordingId);

    if (deleteError) throw deleteError;

    // Then insert new tags if any
    if (tagIds.length > 0) {
      const { error: insertError } = await supabase
        .from('recording_tags')
        .insert(
          tagIds.map(tagId => ({
            recording_id: recordingId,
            tag_id: tagId
          }))
        );

      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Error in updateRecordingTags:', err);
    throw err;
  }
}