export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> => {
  let retries = 0;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      if (
        retries >= maxRetries ||
        !(error.response?.status === 429 || error.response?.status >= 500)
      ) {
        throw error;
      }

      retries++;
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(
        `Retrying operation after ${delay}ms (attempt ${retries} of ${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
