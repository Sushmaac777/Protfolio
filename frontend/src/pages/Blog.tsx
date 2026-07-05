import { useDeferredValue, useMemo, useState } from "react";

import { getBlogs } from "../api/blogs";
import { Loader } from "../components/common/Loader";
import { BlogCard } from "../components/blogs/BlogCard";
import { Filter } from "../components/projects/Filter";
import { useContentValue } from "../hooks/useContentValue";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { uniqueTags } from "../utils/helpers";

export function Blog() {
  const { data, loading } = useFetch(getBlogs);
  const copy = useContentValue("siteCopy");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const tags = useMemo(() => (data ? uniqueTags(data) : []), [data]);
  const filteredBlogs = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((blog) => {
      const searchableText = [blog.title, blog.excerpt, blog.content, blog.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      const matchesQuery = searchableText.includes(deferredQuery.toLowerCase());
      const matchesTag = !activeTag || blog.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [activeTag, data, deferredQuery]);

  if (loading || !data) {
    return <Loader label="Loading articles" />;
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-heading section-heading--blog-page">
          <h2 className="section-heading__inline-copy">{copy.pages.blog.title}</h2>
        </div>
        <Filter
          activeTag={activeTag}
          allOptionLabel="All blog topics"
          onQueryChange={setQuery}
          onTagChange={setActiveTag}
          query={query}
          searchLabel="Search blog posts"
          searchPlaceholder="Search by post, topic, or tag"
          selectLabel="Filter blog posts by topic"
          tags={tags}
        />
        <div className="grid grid--cards">
          {filteredBlogs.map((blog) => (
            <BlogCard blog={blog} key={blog.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
