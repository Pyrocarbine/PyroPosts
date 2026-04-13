// components/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/delete-post/${postId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="absolute top-1 right-1 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow"
    >
      <Trash2 size={18} />
    </button>
  );
}
