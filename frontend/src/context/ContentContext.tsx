import { createContext, type ReactNode, startTransition, useContext, useEffect, useRef, useState } from "react";

import { getContentStreamUrl, getSharedContent, type SharedContentMap } from "../api/content";
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
  const refreshTaskRef = useRef<Promise<void> | null>(null);

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
    if (refreshTaskRef.current) {
      return refreshTaskRef.current;
    }

    const refreshTask = loadContent({ bumpVersion: true, preserveExisting: true }).finally(() => {
      if (refreshTaskRef.current === refreshTask) {
        refreshTaskRef.current = null;
      }
    });

    refreshTaskRef.current = refreshTask;
    return refreshTask;
  }

  useEffect(() => {
    const eventSource = new EventSource(getContentStreamUrl());

    function handleContentChanged() {
      void refreshContent().catch(() => {
        // Keep the existing UI content and let EventSource retry automatically.
      });
    }

    eventSource.addEventListener("content-changed", handleContentChanged);

    return () => {
      eventSource.removeEventListener("content-changed", handleContentChanged);
      eventSource.close();
    };
  }, []);

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
