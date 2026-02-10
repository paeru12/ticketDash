"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

export default function RichTextEditor({ value = "", onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,

      ListItem.configure({
        keepMarks: true,
        keepAttributes: false,
      }),


      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function addImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="border rounded-md bg-white"
      onClick={() => editor.chain().focus().run()} // ✅ klik area mana saja → fokus
    >
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <Divider />

        {[1, 2, 3, 4, 5].map((l) => (
          <ToolbarButton
            key={l}
            onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()}
            active={editor.isActive("heading", { level: l })}
          >
            {l === 1 && <Heading1 size={16} />}
            {l === 2 && <Heading2 size={16} />}
            {l === 3 && <Heading3 size={16} />}
            {l === 4 && <Heading4 size={16} />}
            {l === 5 && <Heading5 size={16} />}
          </ToolbarButton>
        ))}

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}>
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}>
          <ListOrdered size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => {
            const url = prompt("Masukkan URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <label className="toolbar-btn cursor-pointer">
          <ImageIcon size={16} />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => addImage(e.target.files[0])}
          />
        </label>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <div
        className="cursor-text"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent
          editor={editor}
          className="tiptap-editor p-4 min-h-[180px] prose max-w-none"
        />
      </div>

    </div>
  );
}

/* ================== */
/* SMALL COMPONENTS */
/* ================== */

function ToolbarButton({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`toolbar-btn ${active ? "bg-slate-200" : ""}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-2 text-slate-300">|</span>;
}
