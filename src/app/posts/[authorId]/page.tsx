"use client";

import usePosts from "@/services/usePosts";
import { use } from "react";
import Link from "next/link";

interface Prop {
  params: Promise<{ authorId: string }>;
  searchParams: Promise<{ authorName: string }>;
}

export default function Page({ params, searchParams }: Prop) {
  const { authorId } = use(params);
  const { authorName } = use(searchParams);
  const posts = usePosts(authorId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-pink-50 to-blue-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/authors"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-pink-400 transition-colors duration-150 mb-4"
        >
          ← Back to Authors
        </Link>
        <h1 className="text-4xl font-bold text-blue-600">
          {authorName ?? `Author #${authorId}`}
        </h1>
        <p className="mt-1 text-sm text-pink-400 tracking-widest uppercase">
          Published Works
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-xl shadow-blue-200 border border-blue-100 bg-white/70 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-400 to-pink-400 text-white">
              <th className="px-6 py-4 text-left font-semibold tracking-wide w-16">ID</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide w-48">Title</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Content</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post.id}
                className={`
                  border-b border-blue-50 transition-colors duration-150
                  hover:bg-pink-50
                  ${index % 2 === 0 ? "bg-white/60" : "bg-blue-50/40"}
                `}
              >
                <td className="px-6 py-4 font-mono font-semibold text-pink-400">
                  {post.id}
                </td>
                <td className="px-6 py-4 font-semibold text-blue-700">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-gray-500 leading-relaxed">
                  {post.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 px-6 py-3 text-right text-xs text-blue-300 border-t border-blue-100">
          {posts.length} post{posts.length !== 1 ? "s" : ""} total
        </div>
      </div>
    </div>
  );
}