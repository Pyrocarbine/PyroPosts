'use client';
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Summarizer({ content }: { content: string | "" }) {
    const [summary, setSummary] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const getSummary = useCallback(async () => {
        setLoading(true);
        const response = await fetch(`/api/summarize`, { method: "POST", body: JSON.stringify({ content })});
        if (!response.ok) {
            const errorData = await response.json();
            setSummary(errorData.error || "Error fetching summary");
            setLoading(false);
            return;
        }
        try {
            const data = await response.json();
            setSummary(data.summary);
            setLoading(false);
        } catch {
            setSummary("Error fetching summary");
            setLoading(false);
        }
    }, [content]);

    useEffect(() => {
        getSummary();
    }, [getSummary]);

    if (!isVisible) return null;

    return (
        <aside className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-2xl ring-1 ring-slate-700/60 backdrop-blur-sm transition-all duration-300 sm:bottom-6 sm:right-6 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300/90">AI Summary</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-100">Quick overview</h3>

            <div className="mt-3 max-h-56 overflow-y-auto pr-1 text-sm leading-relaxed text-slate-200/90">
                {loading ? (
                    <div className="flex items-center gap-2 text-slate-300">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                        <span>Generating summary…</span>
                    </div>
                ) : (
                    summary
                )}
            </div>

            <button
                type="button"
                onClick={() => setIsVisible(false)}
                aria-label="Close summary"
                className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-600/80 text-slate-300 transition hover:border-slate-400 hover:text-white"
            >
                <X className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
        </aside>
    );
}