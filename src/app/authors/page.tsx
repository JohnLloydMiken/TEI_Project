"use client";
import useAuthors from "@/services/useAuthors";
import Link from "next/link";

export default function Page() {
  const authors = useAuthors();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-8 font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
          Authors
        </h1>
        <p className="mt-1 text-sm text-purple-400 tracking-widest uppercase">
          Directory
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-xl shadow-purple-200 border border-pink-200 bg-white/70 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
              <th className="px-6 py-4 text-left font-semibold tracking-wide">ID</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Full Name</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Email</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Work/s</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr
                key={author.id}
                className={`
                  border-b border-pink-100 transition-colors duration-150
                  hover:bg-pink-50
                  ${index % 2 === 0 ? "bg-white/60" : "bg-purple-50/40"}
                `}
              >
                <td className="px-6 py-4 text-purple-400 font-mono font-semibold">
                  {author.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">
                  {author.full_name}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {author.email}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/posts/${author.id}?authorName=${encodeURIComponent(author.full_name)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-purple-200 transition-all duration-150 hover:from-pink-500 hover:to-purple-600 hover:shadow-md hover:shadow-purple-300 active:scale-95"
                  >
                    See Work/s
                    <span className="text-pink-200">→</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer row */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-3 text-right text-xs text-purple-300 border-t border-pink-100">
          {authors.length} author{authors.length !== 1 ? "s" : ""} total
        </div>
      </div>
    </div>
  );
}