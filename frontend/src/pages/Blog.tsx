import { getBlogs } from "../api/blogs";
import { Loader } from "../components/common/Loader";
import { SectionTitle } from "../components/common/SectionTitle";
import { BlogCard } from "../components/blogs/BlogCard";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function Blog() {
  const { data, loading } = useFetch(getBlogs);
  const copy = useContentValue("siteCopy");

  if (loading || !data) {
    return <Loader label="Loading articles" />;
  }

  return (
    <div className="page">
      <section className="section">
        <SectionTitle eyebrow={copy.pages.blog.eyebrow} title={copy.pages.blog.title} />
        <div className="grid grid--cards">
          {data.map((blog) => (
            <BlogCard blog={blog} key={blog.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
