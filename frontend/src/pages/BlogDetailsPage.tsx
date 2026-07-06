import { useParams } from "react-router-dom";

import { getBlogBySlug } from "../api/blogs";
import { BlogDetails } from "../components/blogs/BlogDetails";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { useFetch } from "../hooks/useFetch";

export function BlogDetailsPage() {
  const { slug = "" } = useParams();
  const { data, loading, error } = useFetch(() => getBlogBySlug(slug), [slug]);

  if (loading) {
    return <Loader label="Loading article" />;
  }

  if (error) {
    return (
      <div className="page">
        <EmptyState title="Could not load article" message="The article details could not be loaded from the backend." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <EmptyState title="Article not found" message="The post you requested could not be found." />
      </div>
    );
  }

  return (
    <div className="page">
      <BlogDetails blog={data} />
    </div>
  );
}
