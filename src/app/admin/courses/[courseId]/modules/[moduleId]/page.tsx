"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ContentBlock {
  id?: string;
  type: string;
  content: any;
  order: number;
}

interface Module {
  title: string;
  outcome: string;
  hasQuiz: boolean;
}

export default function ModuleDetailPage() {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [contentForm, setContentForm] = useState<any>({});
  const [type, setType] = useState("text");
  const [order, setOrder] = useState(1);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Module | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editContentForm, setEditContentForm] = useState<any>({});
  const [editType, setEditType] = useState<string>("");
  const [editOrder, setEditOrder] = useState<number>(1);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!courseId || !moduleId) return;
      const moduleRef = doc(db, "courses_coll", courseId as string, "modules", moduleId as string);
      const moduleSnap = await getDoc(moduleRef);
      if (moduleSnap.exists()) {
        setModule(moduleSnap.data() as Module);
        const contentSnap = await getDocs(collection(moduleRef, "contentBlocks"));
        const content = contentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ContentBlock[];
        setContentBlocks(content);
      }
    };
    fetchModuleDetails();
  }, [courseId, moduleId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !moduleId) return;

    const content =
      type === "markdown" ? { markdown: contentForm.markdown }
      : type === "video" ? { title: contentForm.videoTitle, url: contentForm.videoUrl }
      : type === "list" ? { items: contentForm.list?.split(",").map((item) => item.trim()) || [] }
      : type === "quote" ? { text: contentForm.quote }
      : {};

    const block = { type, content, order };

    const contentRef = await addDoc(collection(db, "courses_coll", courseId as string, "modules", moduleId as string, "contentBlocks"), block);
    const blockWithId = { ...block, id: contentRef.id };
    setContentBlocks((prev) => [...prev, blockWithId]);
    setOrder(order + 1);
    setContentForm({});
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!courseId || !moduleId) return;
    const blockRef = doc(db, "courses_coll", courseId as string, "modules", moduleId as string, "contentBlocks", blockId);
    await deleteDoc(blockRef);
    setContentBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const handleEditClick = async (block: ContentBlock) => {
    setEditingBlockId(block.id!);
    setEditType(block.type);
    setEditOrder(block.order)
    setEditContentForm(block.content)
  }

  const handleEditSave = async () => {
    if (!courseId || !moduleId || !editingBlockId) return;

    const updatedBlock = {
      type: editType,
      content: editContentForm,
      order: editOrder
    }
    const blockRef = doc(
    db,
    "courses_coll",
    courseId as string,
    "modules",
    moduleId as string,
    "contentBlocks",
    editingBlockId
  );

  await setDoc(blockRef, updatedBlock);
  setContentBlocks((prev) =>
    prev.map((b) => (b.id === editingBlockId ? { ...updatedBlock, id: editingBlockId } : b))
  );
  setEditingBlockId(null);
  setEditContentForm({});

  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Module Details</h1>

      {!editMode && module && (
        <div style={{ backgroundColor: "#f9f9f9", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "2rem" }}>
          <h2>{module.title}</h2>
          <p>{module.outcome}</p>
          <button
            onClick={() => { setEditMode(true); setEditForm(module); }}
            style={{ padding: "0.5rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}
          >
            Edit Module
          </button>
        </div>
      )}

      {editMode && editForm && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!courseId || !moduleId) return;
            const moduleRef = doc(db, "courses_coll", courseId as string, "modules", moduleId as string);
            await setDoc(moduleRef, editForm);
            setModule(editForm);
            setEditMode(false);
          }}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "#f9f9f9", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "2rem" }}
        >
          <input name="title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Module Title" />
          <input name="outcome" value={editForm.outcome} onChange={(e) => setEditForm({ ...editForm, outcome: e.target.value })} placeholder="Outcome" />
          <label>
            <input type="checkbox" checked={editForm.hasQuiz} onChange={(e) => setEditForm({ ...editForm, hasQuiz: e.target.checked })} />
            Has Quiz
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" style={{ padding: "0.5rem", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
              Save
            </button>
            <button type="button" onClick={() => setEditMode(false)} style={{ padding: "0.5rem", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 style={{ marginBottom: "0.5rem" }}>Add Content Block</h2>
      <form
        onSubmit={handleAddContent}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "#f9f9f9", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "2rem" }}
      >
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="markdown">Markdown</option>
          <option value="video">Video</option>
          <option value="quote">Quote</option>
          <option value="list">List</option>
          <option value="text">Text</option>
        </select>

        {type === "markdown" && (
          <textarea name="markdown" value={contentForm.markdown || ""} onChange={handleContentChange} placeholder="Markdown content" />
        )}
        {type === "video" && (
          <>
            <input name="videoTitle" value={contentForm.videoTitle || ""} onChange={handleContentChange} placeholder="Video Title" />
            <input name="videoUrl" value={contentForm.videoUrl || ""} onChange={handleContentChange} placeholder="YouTube Embed URL" />
          </>
        )}
        {type === "list" && (
          <textarea name="list" placeholder="Comma-separated list" value={contentForm.list || ""} onChange={handleContentChange} />
        )}
        {type === "quote" && (
          <input name="quote" value={contentForm.quote || ""} onChange={handleContentChange} placeholder="Quote text" />
        )}
        <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="Order" required />
        <button type="submit" style={{ padding: "0.5rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}>
          Add Content Block
        </button>
      </form>

      <h2 style={{ marginBottom: "1rem" }}>Content Blocks</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contentBlocks.map((block) => (
          <li
            key={block.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1rem",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            
          >
            {editingBlockId === block.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <select value={editType} onChange={(e) => setEditType(e.target.value)}>
          <option value="markdown">Markdown</option>
          <option value="video">Video</option>
          <option value="quote">Quote</option>
          <option value="list">List</option>
          <option value="text">Text</option>
        </select>

        {editType === "markdown" && (
          <textarea name="markdown" value={editContentForm.markdown || ""} onChange={(e) => setEditContentForm({ markdown: e.target.value })} />
        )}
        {editType === "video" && (
          <>
            <input
              name="videoTitle"
              placeholder="Video Title"
              value={editContentForm.title || ""}
              onChange={(e) => setEditContentForm({ ...editContentForm, title: e.target.value })}
            />
            <input
              name="videoUrl"
              placeholder="URL"
              value={editContentForm.url || ""}
              onChange={(e) => setEditContentForm({ ...editContentForm, url: e.target.value })}
            />
          </>
        )}
        {editType === "list" && (
          <textarea
            name="items"
            placeholder="Comma separated"
            value={(editContentForm.items || []).join(", ")}
            onChange={(e) =>
              setEditContentForm({ items: e.target.value.split(",").map((item) => item.trim()) })
            }
          />
        )}
        {editType === "quote" && (
          <input
            name="quote"
            value={editContentForm.text || ""}
            onChange={(e) => setEditContentForm({ text: e.target.value })}
          />
        )}

        <input type="number" value={editOrder} onChange={(e) => setEditOrder(Number(e.target.value))} />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={handleEditSave} style={{ backgroundColor: "#28a745", color: "#fff" }}>Save</button>
          <button onClick={() => setEditingBlockId(null)} style={{ backgroundColor: "#6c757d", color: "#fff" }}>Cancel</button>
        </div>
      </div>
            ) :
            
            (
              <>
              <div>
          <strong>[{block.order}] {block.type}</strong>
          <p style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{JSON.stringify(block.content)}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => handleEditClick(block)}
            style={{ padding: "0.4rem 0.75rem", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px" }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteBlock(block.id!)}
            style={{ padding: "0.4rem 0.75rem", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
          >
            Delete
          </button>
        </div>
              </>
            )}
            
          </li>
        ))}
      </ul>

      {module?.hasQuiz && (
        <>
          <h2 style={{ marginTop: "2rem" }}>Quiz Section</h2>
          <Link href={`/admin/courses/${courseId}/modules/${moduleId}/quizzes`}>
            <button style={{ padding: "0.5rem", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px" }}>
              Manage Quizzes
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
