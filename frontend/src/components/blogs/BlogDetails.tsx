import type { Blog } from "../../types/blog";
import { formatMonthDate } from "../../utils/helpers";
import { Badge } from "../common/Badge";

export function BlogDetails({ blog }: { blog: Blog }) {
  return (
    <section className="section">
      <article className="prose-card prose-card--wide">
        <div className="project-card__meta">
          <Badge>{formatMonthDate(blog.published_at)}</Badge>
          <span>{blog.reading_time}</span>
        </div>
        <h1>{blog.title}</h1>
        <p>{blog.content}</p>
      </article>
    </section>
  );
}

