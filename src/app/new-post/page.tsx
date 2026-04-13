'use client';
import { use, useState, useRef } from "react"; 
import { useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from 'tiptap-extension-resize-image';
import type { Editor as EditorType } from "@tiptap/react"; 


function ImageUploadButton({ editor }: { editor: EditorType | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-url", {
      method: "POST",
      body: formData,
    });
    if (res.status !== 200){
      return;
    }
    const { getUrl } = await res.json();

    // Step 3: insert into TipTap
    editor.chain().focus().setImage({ src: getUrl }).run();

    e.target.value = "";
  };
  
  const addImage = () => {
    fileInputRef.current?.click(); // Open file picker programmatically
  };

  return (
    <>
      <div
        onClick={addImage}
        className="px-2 py-1 border-b cursor-pointer"
      >
        Add Image
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

function MenuBar( { editor }: {editor: EditorType | null } ) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-3">
      <div
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="px-2 py-1 border-b cursor-pointer"
      >
        Bold
      </div>
      <ImageUploadButton editor={editor}/>
    </div>
  );
}

export default function NewPostPage() {
    const [postTitle, setPostTitle] = useState("");
    const [error, setError] = useState("");
    const editor: EditorType | null = useEditor({
        extensions: [StarterKit, Image, ImageResize],
        content: "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
              class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
        },
    });
    const isFormValid : boolean | null = postTitle.trim() !== "" && editor && editor.getHTML().trim() !== "";
    async function submitPost(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(!editor) return;
        const contentHTML = editor.getHTML();
        if (!isFormValid) {
            setError("Both title and content are required.");
            return;
        }
        try {
            const res = await fetch("/api/make-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: postTitle, content: contentHTML }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong!");
            }

            setPostTitle("");
            editor.commands.clearContent();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message); // Safe: err is an Error
            } else {
                setError("An unexpected error occurred"); // fallback
            }
        }
    }
    return (
        <main>
            <div className="text-center text-3xl pb-8 pt-2 mt-5">Create a new post!</div>
            <div className="w-1/2 block m-auto">
                <form onSubmit={submitPost} className="space-y-4">
                    <input type="text" value={postTitle} placeholder="Title" onChange={(e) => setPostTitle(e.target.value)} className="w-full border p-2 mb-5"/>
                    <div className="pt-1 pb-3 pl-4 pr-4 border rounded-lg prose max-w-none">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`block m-auto w-1/2 border rounded pt-3 pb-3 transition-colors ${
                        isFormValid
                            ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Submit Post
                    </button>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>
            </div>
        </main>
    );
}