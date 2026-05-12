"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    const search = params.toString();
    const path = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    router.replace(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">Search posts</label>
      <div className="flex gap-2">
        <input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts by title..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white selection:bg-indigo-200 selection:text-black"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}
