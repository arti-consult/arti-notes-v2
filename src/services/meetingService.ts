

export async function deleteMeeting(meetingId: string) {
  try {
    // First, get the recording details to get the file path
    const { data: recording, error: fetchError } = await supabase
      .from('recordings')
      .select('file_url')
      .eq('id', meetingId)
      .single();

    if (fetchError) throw fetchError;

    if (recording?.file_url) {
      // Extract the file path from the URL
      const url = new URL(recording.file_url);
      const pathParts = url.pathname.split('/');
      const userId = pathParts[pathParts.length - 2];
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${userId}/${fileName}`;

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('recordings')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete the recording (this will cascade to transcriptions due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('recordings')
      .delete()
      .eq('id', meetingId);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw new Error('Kunne ikke slette møtet');
  }
}