import { Link } from "react-router-dom";

import type { Blog } from "../../types/blog";
import { formatMonthDate } from "../../utils/helpers";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card>
      <div className="project-card__meta">
        <Badge>{formatMonthDate(blog.published_at)}</Badge>
        <span>{blog.reading_time}</span>
      </div>
      <h3>{blog.title}</h3>
      <p>{blog.excerpt}</p>
      <div className="badge-row">
        {blog.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Link className="text-link" to={`/blog/${blog.slug}`}>
        Read article
      </Link>
    </Card>
  );
}

