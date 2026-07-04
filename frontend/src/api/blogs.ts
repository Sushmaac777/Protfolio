import { mockBlogs } from "../data/mockPortfolio";
import type { Blog } from "../types/blog";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getBlogs(): Promise<Blog[]> {
  const override = readContentOverride("blogs");
  if (override) {
    return override;
  }

  try {
    const response = await api.get<Blog[]>("/blogs");
    return response.data;
  } catch {
    return mockBlogs;
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const override = readContentOverride("blogs");
  if (override) {
    return override.find((blog) => blog.slug === slug);
  }

  try {
    const response = await api.get<Blog>(`/blogs/${slug}`);
    return response.data;
  } catch {
    return mockBlogs.find((blog) => blog.slug === slug);
  }
}
