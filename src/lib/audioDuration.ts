interface AudioDurationOptions {
  fallbackDuration?: number;
  timeout?: number;
}

/**
 * Get audio duration using multiple methods
 */
export async function getAudioDuration(
  blob: Blob,
  options: AudioDurationOptions = {}
): Promise<number> {
  const { fallbackDuration = 1, timeout = 5000 } = options || {};

  // Input validation
  if (!blob || blob.size === 0) {
    console.warn("Invalid blob provided to getAudioDuration");
    return Math.max(1, fallbackDuration);
  }

  // Method 1: Web Audio API
  async function getWebAudioDuration(): Promise<number> {
    const audioContext = new AudioContext();
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const duration = Math.max(1, Math.round(audioBuffer.duration));
      console.log("Web Audio API duration:", duration);
      return duration;
    } catch (error) {
      console.warn("Web Audio API duration failed:", error);
      return 0;
    } finally {
      audioContext.close().catch(console.warn);
    }
  }

  // Method 2: HTML Audio element
  async function getAudioElementDuration(): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(blob);

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        resolve(0);
      }, timeout);

      audio.addEventListener("loadedmetadata", () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        const duration = Math.max(1, Math.round(audio.duration));
        console.log("Audio element duration:", duration);
        resolve(duration);
      });

      audio.addEventListener("error", () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        resolve(0);
      });

      audio.src = objectUrl;
    });
  }

  // Method 3: MediaSource API
  async function getMediaSourceDuration(): Promise<number> {
    return new Promise((resolve) => {
      const mediaSource = new MediaSource();
      const url = URL.createObjectURL(mediaSource);
      const audio = new Audio(url);

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(0);
      }, timeout);

      mediaSource.addEventListener("sourceopen", async () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(blob.type);
          const arrayBuffer = await blob.arrayBuffer();

          sourceBuffer.addEventListener("updateend", () => {
            clearTimeout(timeoutId);
            URL.revokeObjectURL(url);
            const duration = Math.max(1, Math.round(mediaSource.duration));
            console.log("MediaSource duration:", duration);
            resolve(duration);
          });

          sourceBuffer.appendBuffer(arrayBuffer);
        } catch (error) {
          console.warn("MediaSource duration failed:", error);
          clearTimeout(timeoutId);
          URL.revokeObjectURL(url);
          resolve(0);
        }
      });
    });
  }

  try {
    // Try all methods in parallel
    const [webAudioDuration, audioElementDuration, mediaSourceDuration] =
      await Promise.all([
        getWebAudioDuration(),
        getAudioElementDuration(),
        getMediaSourceDuration(),
      ]);

    console.log("Duration results:", {
      webAudio: webAudioDuration,
      audioElement: audioElementDuration,
      mediaSource: mediaSourceDuration,
      fallback: fallbackDuration,
    });

    // Use the most reliable duration
    const durations = [
      webAudioDuration,
      audioElementDuration,
      mediaSourceDuration,
    ].filter((d) => Number.isFinite(d) && d > 0);

    console.log("Valid durations:", durations);

    if (durations.length === 0) {
      console.warn("All duration methods failed, using fallback");
      return Math.max(1, Math.round(fallbackDuration));
    }

    // Use the median duration
    durations.sort((a, b) => a - b);
    const medianDuration = durations[Math.floor(durations.length / 2)];
    const finalDuration = Math.max(1, Math.round(medianDuration));

    console.log("Final duration:", {
      median: medianDuration,
      final: finalDuration,
      durations,
    });

    return finalDuration;
  } catch (error) {
    console.error("Error getting audio duration:", error);
    const fallbackValue = Math.max(1, Math.round(fallbackDuration || 1));
    console.log("Using fallback duration after error:", fallbackValue);
    return fallbackValue;
  }
}
