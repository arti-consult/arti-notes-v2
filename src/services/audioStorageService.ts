

export async function getSignedUrl(recordingId: string): Promise<string> {
  try {
    // Fetch recording details
    const { data: recording, error: recordingError } = await supabase
      .from('recordings')
      .select('file_url')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording?.file_url) {
      throw new Error('Kunne ikke hente opptak');
    }

    // Extract file path from the public URL
    const fileUrl = new URL(recording.file_url);
    const pathParts = fileUrl.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const userId = pathParts[pathParts.length - 2];
    
    if (!fileName || !userId) {
      throw new Error('Ugyldig filbane');
    }

    const filePath = `${userId}/${fileName}`;

    // Get a signed URL
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('recordings')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (signedError) {
      throw signedError;
    }

    if (!signedData?.signedUrl) {
      throw new Error('Ingen URL generert');
    }

    return signedData.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error instanceof Error ? error : new Error('Kunne ikke hente lydfil');
  }
}

export async function getPublicUrl(recordingId: string): Promise<string> {
  try {
    // Fetch recording details
    const { data: recording, error: recordingError } = await supabase
      .from('recordings')
      .select('file_url')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording?.file_url) {
      throw new Error('Kunne ikke hente opptak');
    }

    // Add download flag to URL
    return `${recording.file_url}?download=true`;
  } catch (error) {
    console.error('Error getting public URL:', error);
    throw error instanceof Error ? error : new Error('Kunne ikke hente lydfil');
  }
}