"use client";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
}

export default function usePosts(authorId: string) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!authorId) return; // guard clause

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?authorId=${authorId}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (e) {
        console.error("Error:", e);
      }
    };

    fetchPosts();
  }, [authorId]); // ✅ re-fetches if authorId changes

  return posts;
}