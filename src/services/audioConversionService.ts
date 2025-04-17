import { saveAs } from 'file-saver';


export async function downloadAudioAsMp3(fileUrl: string, title: string): Promise<void> {
  try {
    if (!fileUrl) {
      throw new Error('Ingen lydfil tilgjengelig');
    }

    console.log('Starting audio download...', { fileUrl });

    // Extract path from URL and recording ID
    const urlObj = new URL(fileUrl);
    const filePath = urlObj.pathname.split('/').slice(-2).join('/');
    const recordingId = filePath.split('/').pop()?.split('.')[0];
    
    if (!recordingId) {
      throw new Error('Kunne ikke finne opptaks-ID');
    }

    console.log('Requesting MP3 conversion...', { recordingId });
    
    // Call Edge Function to convert and get MP3 URL
    const { data: conversionData, error: conversionError } = await supabase.functions.invoke(
      'convert-to-mp3',
      {
        body: { recordingId }
      }
    );

    if (conversionError) {
      console.error('Conversion error:', conversionError);
      throw new Error('Kunne ikke konvertere lydfilen');
    }

    if (!conversionData?.mp3Url) {
      throw new Error('Ingen MP3-fil tilgjengelig');
    }

    // Download the converted MP3 file
    const response = await fetch(conversionData.mp3Url);
    if (!response.ok) {
      throw new Error('Kunne ikke laste ned MP3-filen');
    }

    const mp3Blob = await response.blob();
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${safeTitle}-${timestamp}.mp3`;

    console.log('Saving MP3 file as:', filename);
    saveAs(mp3Blob, filename);

    console.log('Audio download completed successfully');
  } catch (error) {
    console.error('Error in downloadAudioAsMp3:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Kunne ikke laste ned lydfilen'
    );
  }
}