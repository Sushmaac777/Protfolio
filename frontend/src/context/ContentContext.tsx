import { createContext, type ReactNode, startTransition, useContext, useEffect, useState } from "react";

import { getSharedContent, type SharedContentMap } from "../api/content";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";

type SharedContentKey = keyof SharedContentMap;

type ContentContextValue = SharedContentMap & {
  contentVersion: number;
  refreshContent: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SharedContentMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentVersion, setContentVersion] = useState(0);

  async function loadContent(options?: { bumpVersion?: boolean; preserveExisting?: boolean }) {
    try {
      const data = await getSharedContent();
      setContent(data);
      setError(null);

      if (options?.bumpVersion) {
        startTransition(() => {
          setContentVersion((current) => current + 1);
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load content from the backend.";

      if (!options?.preserveExisting) {
        setError(message);
      } else {
        throw err;
      }
    }
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setLoading(true);

      try {
        const data = await getSharedContent();
        if (!active) {
          return;
        }

        setContent(data);
        setError(null);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load content from the backend.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  async function refreshContent() {
    await loadContent({ bumpVersion: true, preserveExisting: true });
  }

  if (loading && !content) {
    return <Loader label="Loading site content" />;
  }

  if (!content) {
    return (
      <div className="page">
        <EmptyState
          title="Could not load site content"
          message={error ?? "The frontend could not retrieve content from the backend."}
        />
      </div>
    );
  }

  return (
    <ContentContext.Provider
      value={{
        ...content,
        contentVersion,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used inside ContentProvider.");
  }
  return context;
}

export function useSharedContentValue<K extends SharedContentKey>(key: K): SharedContentMap[K] {
  const context = useContent();
  return context[key];
}
