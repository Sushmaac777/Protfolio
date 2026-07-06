import { DependencyList, startTransition, useEffect, useState } from "react";

import { useContent } from "../context/ContentContext";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList = []): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contentVersion } = useContent();

  useEffect(() => {
    let active = true;

    async function load() {
      startTransition(() => {
        setLoading(true);
        setError(null);
      });

      try {
        const result = await fetcher();
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [contentVersion, ...deps]);

  return { data, loading, error };
}
