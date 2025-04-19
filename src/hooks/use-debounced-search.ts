import { useState, useEffect, useRef, useCallback } from "react";

export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300,
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchFnRef = useRef(searchFn);
  useEffect(() => {
    searchFnRef.current = searchFn;
  }, [searchFn]);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setError(null);

    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);

        try {
          const data = await searchFnRef.current(query);

          if (isMountedRef.current) {
            console.log("data: ", data);
            setResults(data);
          }
        } catch (err) {
          console.error("Search error:", err);

          if (isMountedRef.current) {
            setResults([]);
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        } finally {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        }
      } else {
        setResults([]);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const reset = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    setResults,
    isLoading,
    error,
    reset,
  };
}
