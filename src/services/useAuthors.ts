"use client";
import { useState, useEffect } from "react";

export default function useAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");
        if (!response.ok) throw new Error("Error fetching Authors");
        const data = await response.json();
        setAuthors(data);
      } catch (e) {
        console.log("Error:" + e);
      }
    };
    fetchAuthors();
  }, []);

  return authors;
}