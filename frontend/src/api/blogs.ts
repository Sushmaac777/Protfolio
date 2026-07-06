import axios from "axios";
import type { Blog } from "../types/blog";
import api from "./axios";

export async function getBlogs(): Promise<Blog[]> {
  const response = await api.get<Blog[]>("/blogs");
  return response.data;
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    const response = await api.get<Blog>(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }

    throw error;
  }
}
