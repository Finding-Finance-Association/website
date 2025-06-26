"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
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
    const [contentForm, setContentForm] = useState<any>({})
    const [type, setType] = useState("text");
    const [order, setOrder] = useState(1);
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            if (!courseId || !moduleId) return;
            const moduleRef = doc(db, "courses_coll", courseId as string, "modules", moduleId as string);
            const moduleSnap = await getDoc(moduleRef);
            if (moduleSnap.exists()) {
                setModule(moduleSnap.data() as Module);
                const contentSnap = await getDocs(collection(moduleRef,"contentBlocks"))
                const content = contentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data()})) as ContentBlock[];
                setContentBlocks(content)
            };

            

    }
    fetchModuleDetails();
}, [courseId, moduleId])

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentForm((prev: any) => ({ ...prev, [name]: value }));
  };

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!courseId || !moduleId) return;

        const content =
            type === "markdown" ? {markdown: contentForm.markdown}
            : type === "video" ? {title: contentForm.videoTitle, url: contentForm.videoUrl}
            : type === "list" ? {items: contentForm.list?.split(",").map((item) => item.trim()) || []}
            : type === "quote" ? {text: contentForm.quote}
            : {};
         
        const block = {
            type, content, order,
        }  
        
        const contentref = await addDoc(collection(db,"courses_coll", courseId as string, "modules", moduleId as string,"contentBlocks"),block )

        const blockWithId = {...block, id: contentref.id};
        setContentBlocks((prev) => [...prev, blockWithId]);
        setOrder(order + 1);
        setContentForm({})
    }

    const handleDeleteBlock = async (blockId: string) => {
  if (!courseId || !moduleId) return;

  const blockRef = doc(
    db,
    "youHaveACollectionOfCourses",
    courseId as string,
    "modules",
    moduleId as string,
    "contentBlocks",
    blockId
  );

  await deleteDoc(blockRef);
  setContentBlocks((prev) => prev.filter((block) => block.id !== blockId));
};
    return (
 <div style={{ padding: 20 }}>
      <h1>Module Details</h1>
      {module && (
        <div>
          <h2>{module.title}</h2>
          <p>{module.outcome}</p>
        </div>
      )}

      <h2>Add Content Block</h2>
      <form onSubmit={handleAddContent} style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
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
        <button type="submit">Add Content Block</button>
      </form>

      <h2>Content Blocks</h2>
      <ul>
        {contentBlocks.map((block) => (
         <li key={block.id}>
      [{block.order}] {block.type} - {JSON.stringify(block.content)}
      <button
        onClick={() => handleDeleteBlock(block.id!)}
        style={{ marginLeft: 10, color: "red" }}
      >
        Delete
      </button>
    </li>
        ))}
      </ul>
 {module?.hasQuiz && (
        <>
          <h2>Quiz Section</h2>
          <Link href={`/admin/courses/${courseId}/modules/${moduleId}/quizzes`}>
            <button>Manage Quizzes</button>
          </Link>
        </>
      )}
    </div>
  );
}

