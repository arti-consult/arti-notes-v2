

// Maximum file size in bytes (100MB)
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  url?: string;
}

export async function validateAudioFile(file: File): Promise<ValidationResult> {
  const isAudioOrVideo = file.type.startsWith('audio/') || file.type.startsWith('video/');
  if (!isAudioOrVideo) {
    return {
      isValid: false,
      error: 'Vennligst velg en gyldig lyd- eller videofil'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
    return {
      isValid: false,
      error: `Filen er for stor. Maksimal størrelse er ${sizeMB}MB.`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'Filen er tom'
    };
  }

  // Check if file type is supported by Salad
  if (!transcriptionConfig.audio.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Filformatet støttes ikke. Støttede formater: MP3, WAV, AAC, MP4, MOV, MKV, WebM'
    };
  }

  // Verify file can be read
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return {
        isValid: false,
        error: 'Kunne ikke lese filen'
      };
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return {
      isValid: false,
      error: 'Kunne ikke lese filen'
    };
  }

  return { isValid: true };
}