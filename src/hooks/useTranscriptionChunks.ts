import { useMemo } from 'react';

const CHUNK_SIZE = 1000; // Number of words per chunk

interface TranscriptionSegment {
  text: string;
  timestamp: number;
}

export function useTranscriptionChunks(content: TranscriptionSegment[]) {
  return useMemo(() => {
    const chunks: string[] = [];
    let currentChunk = '';
    let wordCount = 0;

    content.forEach(segment => {
      const words = segment.text.split(' ');
      
      words.forEach(word => {
        if (wordCount >= CHUNK_SIZE) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
          wordCount = 0;
        }
        
        currentChunk += word + ' ';
        wordCount++;
      });
    });

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }, [content]);
}