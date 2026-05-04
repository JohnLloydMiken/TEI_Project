"use client";
import * as React from "react";
import { Eye, EyeClosedIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
export default function LoginForm() {
  const [isVisible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formdata = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formdata.get("email"),
      password: formdata.get("password"), 
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      toast.error("Invalid email or password");
      setPassword("");
    } else {
      toast.success("Succesfully Log In");

      setTimeout(() => {
        router.push("/dashboard/upload-list"); // ✅ success
        router.refresh();
      }, 1500);
    }
  }

  return (
    <div className="border border-gray-200 w-11/12 md:w-5/12 lg:w-3/12 rounded-2xl overflow-hidden shadow-sm z-10">
      {/* Header */}
      <div className="w-full px-6 py-5 bg-teiblue">
        <p className="text-white text-xl font-semibold tracking-wide">
          Staff Login
        </p>
        <p className="text-white/55 text-sm font-light mt-1">
          Sign in with your TEI account credentials
        </p>
      </div>

      {/* Form body */}
      <form
        onSubmit={handleSubmit}
        className="w-full px-6 py-10 flex flex-col gap-10 bg-white"
      >
        {/* Employee Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Employee Email
          </label>
          <div className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-teiblue focus-within:ring-1 focus-within:ring-teiblue transition">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juandelacruz@tei.com"
              required
            
              className="w-full py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Password
          </label>
          <div className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-teiblue focus-within:ring-1 focus-within:ring-teiblue transition">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              required
                value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            />
            {/* Show/hide toggle — wire up with useState if needed */}
            {isVisible ? (
              <EyeClosedIcon onClick={() => setVisible(!isVisible)} color="gray"/>
            ) : (
              <Eye onClick={() => setVisible(!isVisible)} color="gray" />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teiorange hover:bg-teiorange/90 active:scale-[0.98] text-white font-medium text-sm py-2.5 rounded-lg transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-xs text-gray-400">
          For account issues, contact IT Support
        </p>
      </form>
    </div>
  );
}
