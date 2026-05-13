"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { options } from "../lib/definitions";

type FilterContextValue = {
  query: string;
  selectedTags: string[];
  setQuery: (value: string) => void;
  toggleTag: (tag: string) => void;
  matches: (searchValue: string, tags: string[]) => boolean;
};

const FilterContext = createContext<FilterContextValue | null>(null);

function usePostFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("Search components must be used inside SearchFilterProvider.");
  }
  return context;
}

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag],
    );
  };

  const value = useMemo<FilterContextValue>(() => {
    return {
      query,
      selectedTags,
      setQuery,
      toggleTag,
      matches: (searchValue: string, tags: string[]) => {
        const term = query.trim().toLowerCase();
        const normalizedSearchValue = searchValue.toLowerCase();
        const matchesQuery = term === "" || normalizedSearchValue.includes(term);
        const matchesTags =
          selectedTags.length === 0 || selectedTags.every((tag) => tags.includes(tag));
        return matchesQuery && matchesTags;
      },
    };
  }, [query, selectedTags]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function FilterablePost({
  searchValue,
  tags,
  children,
}: {
  searchValue: string;
  tags: string[];
  children: ReactNode;
}) {
  const { matches } = usePostFilters();
  if (!matches(searchValue, tags)) return null;
  return <>{children}</>;
}

export function EmptySearchState({
  items,
}: {
  items: Array<{ searchValue: string; tags: string[] }>;
}) {
  const { matches } = usePostFilters();
  const hasVisiblePosts = items.some((item) => matches(item.searchValue, item.tags));

  if (hasVisiblePosts) return null;
  return <p className="text-center text-gray-500 py-8">No posts match your search.</p>;
}

export default function SearchBar() {
  const { query, setQuery, selectedTags, toggleTag } = usePostFilters();

  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">Search posts</label>
      <div className="flex gap-2">
        <input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white selection:bg-indigo-200 selection:text-black"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedTags.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
