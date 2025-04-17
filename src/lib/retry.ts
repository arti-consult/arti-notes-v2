interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry?: (error: any) => boolean;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let attempt = 1;
  let delay = options.initialDelay;

  while (attempt <= options.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === options.maxAttempts || 
         (options.shouldRetry && !options.shouldRetry(error))) {
        throw error;
      }

      console.warn(
        `Attempt ${attempt} failed, retrying in ${delay}ms...`,
        error
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with jitter
      delay = Math.min(
        delay * 2 * (0.9 + Math.random() * 0.2),
        options.maxDelay
      );
      
      attempt++;
    }
  }

  throw new Error('Retry failed: max attempts exceeded');
}