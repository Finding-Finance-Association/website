"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import QuizPreview from "@/components/admin/QuizPreview";

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
  order?: number;
}

interface Question {
  id?: string;
  type: "mcq" | "text";
  question: string;
  options?: string[];
  correctAnswer: string;
}

export default function ModuleDetailPage() {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [contentForm, setContentForm] = useState<any>({});
  const [type, setType] = useState("text");
  const [order, setOrder] = useState(1);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Module | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editContentForm, setEditContentForm] = useState<any>({});
  const [editType, setEditType] = useState<string>("");

  // Quiz management state
  const [quizzes, setQuizzes] = useState<Question[]>([]);
  const [quizForm, setQuizForm] = useState<Question>({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [showQuizForm, setShowQuizForm] = useState(false);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!courseId || !moduleId) return;

      // Fetch course title
      const courseRef = doc(db, "courses_coll", courseId as string);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourseTitle(courseSnap.data().title || "");
      }

      // Fetch module details
      const moduleRef = doc(db, "courses_coll", courseId as string, "modules", moduleId as string);
      const moduleSnap = await getDoc(moduleRef);
      if (moduleSnap.exists()) {
        setModule(moduleSnap.data() as Module);
        setEditForm(moduleSnap.data() as Module);
        const contentSnap = await getDocs(collection(moduleRef, "contentBlocks"));
        const content = contentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ContentBlock[];
        setContentBlocks(content);

        // Fetch quiz questions for this module
        const quizzesRef = collection(moduleRef, "quizzes");
        const quizzesSnap = await getDocs(quizzesRef);
        const quizQuestions = quizzesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setQuizzes(quizQuestions);
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
      type === "markdown"
        ? { markdown: contentForm.markdown }
        : type === "video"
        ? { title: contentForm.videoTitle, url: contentForm.videoUrl }
        : type === "list"
        ? { items: contentForm.list?.split(",").map((item: any) => item.trim()) || [] }
        : type === "quote"
        ? { text: contentForm.quote }
        : { text: contentForm.text || "" };

    const block = { type, content, order };

    const contentRef = await addDoc(
      collection(db, "courses_coll", courseId as string, "modules", moduleId as string, "contentBlocks"),
      block
    );
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
    setEditContentForm(block.content);
    setOrder(block.order);
  };

  const handleEditSave = async () => {
    if (!courseId || !moduleId || !editingBlockId) return;

    const updatedBlock = {
      type: editType,
      content: editContentForm,
      order,
    };

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
    setOrder(1);
  };

  // Quiz Management Functions
  const handleQuizFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("option-")) {
      const optionIndex = parseInt(name.split("-")[1]);
      setQuizForm(prev => ({
        ...prev,
        options: prev.options?.map((opt, idx) => idx === optionIndex ? value : opt) || []
      }));
    } else {
      setQuizForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !moduleId) return;

    try {
      const quizzesRef = collection(
        doc(db, "courses_coll", courseId as string, "modules", moduleId as string),
        "quizzes"
      );

      const quizData: any = {
        type: quizForm.type,
        question: quizForm.question,
        correctAnswer: quizForm.correctAnswer,
      };

      // Only add options field for MCQ questions
      if (quizForm.type === "mcq") {
        quizData.options = quizForm.options?.filter(opt => opt.trim()) || [];
      }

      const newQuizRef = await addDoc(quizzesRef, quizData);
      const newQuiz = { ...quizData, id: newQuizRef.id };
      setQuizzes(prev => [...prev, newQuiz]);

      // Reset form
      setQuizForm({
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      setShowQuizForm(false);
    } catch (err) {
      console.error("Failed to add quiz question:", err);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!courseId || !moduleId || !confirm("Are you sure you want to delete this quiz question?")) return;

    try {
      const quizRef = doc(
        db,
        "courses_coll",
        courseId as string,
        "modules",
        moduleId as string,
        "quizzes",
        quizId
      );
      await deleteDoc(quizRef);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    } catch (err) {
      console.error("Failed to delete quiz question:", err);
    }
  };

  const handleEditQuiz = (quiz: Question) => {
    setQuizForm({
      ...quiz,
      options: quiz.options || ["", "", "", ""]
    });
    setEditingQuizId(quiz.id || null);
    setShowQuizForm(true);
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !moduleId || !editingQuizId) return;

    try {
      const quizRef = doc(
        db,
        "courses_coll",
        courseId as string,
        "modules",
        moduleId as string,
        "quizzes",
        editingQuizId
      );

      const quizData: any = {
        type: quizForm.type,
        question: quizForm.question,
        correctAnswer: quizForm.correctAnswer,
      };

      // Only add options field for MCQ questions
      if (quizForm.type === "mcq") {
        quizData.options = quizForm.options?.filter(opt => opt.trim()) || [];
      }

      await setDoc(quizRef, quizData);
      setQuizzes(prev => prev.map(q => q.id === editingQuizId ? { ...quizData, id: editingQuizId } : q));

      // Reset form
      setQuizForm({
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      setEditingQuizId(null);
      setShowQuizForm(false);
    } catch (err) {
      console.error("Failed to update quiz question:", err);
    }
  };

  return (
    <AdminLayout
      courseTitle={courseTitle}
      moduleTitle={module?.title}
      courseId={courseId as string}
      moduleId={moduleId as string}
      pageTitle={module?.title || "Module Content"}
      pageDescription="Manage module content blocks. Add text, videos, lists, and other interactive elements."
    >

      {/* Module display or edit */}
      {!editMode && module && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "1.25rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>{module.title}</h2>
          <p style={{ marginBottom: "0.5rem" }}>{module.outcome}</p>
          <p>
            <strong>Has Quiz:</strong> {module.hasQuiz ? "Yes" : "No"}
          </p>
          <button
            onClick={() => {
              setEditMode(true);
              setEditForm(module);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f9f9f9",
            padding: "1.25rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            Title
            <input
              name="title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Module Title"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </label>

          <label style={{ fontWeight: "bold" }}>
            Outcome
            <textarea
              name="outcome"
              value={editForm.outcome}
              onChange={(e) => setEditForm({ ...editForm, outcome: e.target.value })}
              placeholder="Module Outcome"
              required
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
            <input
              type="checkbox"
              checked={editForm.hasQuiz}
              onChange={(e) => setEditForm({ ...editForm, hasQuiz: e.target.checked })}
            />
            Has Quiz
          </label>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Content Block */}
      <h2 style={{ marginBottom: "0.5rem" }}>Add Content Block</h2>
      <form
        onSubmit={handleAddContent}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          backgroundColor: "#f9f9f9",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="markdown">Markdown</option>
          <option value="video">Video</option>
          <option value="quote">Quote</option>
          <option value="list">List</option>
          <option value="text">Text</option>
        </select>

        {type === "markdown" && (
          <textarea
            name="markdown"
            value={contentForm.markdown || ""}
            onChange={handleContentChange}
            placeholder="Markdown content"
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
            rows={4}
          />
        )}
        {type === "video" && (
          <>
            <input
              name="videoTitle"
              value={contentForm.videoTitle || ""}
              onChange={handleContentChange}
              placeholder="Video Title"
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <input
              name="videoUrl"
              value={contentForm.videoUrl || ""}
              onChange={handleContentChange}
              placeholder="YouTube Embed URL"
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </>
        )}
        {type === "list" && (
          <textarea
            name="list"
            placeholder="Comma-separated list"
            value={contentForm.list || ""}
            onChange={handleContentChange}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
            rows={3}
          />
        )}
        {type === "quote" && (
          <input
            name="quote"
            value={contentForm.quote || ""}
            onChange={handleContentChange}
            placeholder="Quote text"
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        )}
        {type === "text" && (
          <textarea
            name="text"
            value={contentForm.text || ""}
            onChange={handleContentChange}
            placeholder="Text content"
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
            rows={3}
          />
        )}

        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="Order"
          required
          min={1}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "6rem" }}
        />

        <button
          type="submit"
          style={{
            padding: "0.5rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Content Block
        </button>
      </form>

      {/* Content Blocks List */}
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
              alignItems: "flex-start",
            }}
          >
            {editingBlockId === block.id ? (
              <div style={{ flex: 1 }}>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "0.5rem" }}
                >
                  <option value="markdown">Markdown</option>
                  <option value="video">Video</option>
                  <option value="quote">Quote</option>
                  <option value="list">List</option>
                  <option value="text">Text</option>
                </select>

                {editType === "markdown" && (
                  <textarea
                    name="markdown"
                    value={editContentForm.markdown || ""}
                    onChange={(e) => setEditContentForm({ ...editContentForm, markdown: e.target.value })}
                    placeholder="Markdown content"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                    rows={4}
                  />
                )}
                {editType === "video" && (
                  <>
                    <input
                      name="videoTitle"
                      value={editContentForm.title || ""}
                      onChange={(e) => setEditContentForm({ ...editContentForm, title: e.target.value })}
                      placeholder="Video Title"
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "0.3rem" }}
                    />
                    <input
                      name="videoUrl"
                      value={editContentForm.url || ""}
                      onChange={(e) => setEditContentForm({ ...editContentForm, url: e.target.value })}
                      placeholder="YouTube Embed URL"
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </>
                )}
                {editType === "list" && (
                  <textarea
                    name="list"
                    value={editContentForm.items?.join(", ") || ""}
                    onChange={(e) =>
                      setEditContentForm({ ...editContentForm, items: e.target.value.split(",").map((i) => i.trim()) })
                    }
                    placeholder="Comma-separated list"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                    rows={3}
                  />
                )}
                {editType === "quote" && (
                  <input
                    name="quote"
                    value={editContentForm.text || ""}
                    onChange={(e) => setEditContentForm({ ...editContentForm, text: e.target.value })}
                    placeholder="Quote text"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                )}
                {editType === "text" && (
                  <textarea
                    name="text"
                    value={editContentForm.text || ""}
                    onChange={(e) => setEditContentForm({ ...editContentForm, text: e.target.value })}
                    placeholder="Text content"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                    rows={3}
                  />
                )}

                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="Order"
                  min={1}
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", marginTop: "0.5rem", width: "6rem" }}
                />

                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleEditSave}
                    style={{
                      padding: "0.4rem 1rem",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    style={{
                      padding: "0.4rem 1rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Type:</strong> {block.type}
                </p>
                <p>
                  <strong>Content:</strong>{" "}
                  {block.type === "markdown"
                    ? block.content.markdown
                    : block.type === "video"
                    ? `${block.content.title} (${block.content.url})`
                    : block.type === "list"
                    ? block.content.items.join(", ")
                    : block.type === "quote"
                    ? `"${block.content.text}"`
                    : block.content.text}
                </p>
                <p>
                  <strong>Order:</strong> {block.order}
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {editingBlockId !== block.id && (
                <>
                  <button
                    onClick={() => handleEditClick(block)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      backgroundColor: "#ffc107",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "#212529",
                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id!)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      backgroundColor: "#dc3545",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Quiz Management Section */}
      {module?.hasQuiz && (
        <div style={{ marginTop: "3rem", borderTop: "2px solid #e9ecef", paddingTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0, color: "#495057" }}>
              Module Quiz Questions ({quizzes.length})
            </h2>
            <button
              onClick={() => setShowQuizForm(true)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              + Add Quiz Question
            </button>
          </div>

          {/* Quiz Form */}
          {showQuizForm && (
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              marginBottom: "2rem"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                {editingQuizId ? "Edit Quiz Question" : "Add New Quiz Question"}
              </h3>
              <form onSubmit={editingQuizId ? handleUpdateQuiz : handleAddQuiz}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    Question Type:
                  </label>
                  <select
                    name="type"
                    value={quizForm.type}
                    onChange={handleQuizFormChange}
                    style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }}
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="text">Text Answer</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    Question:
                  </label>
                  <textarea
                    name="question"
                    value={quizForm.question}
                    onChange={handleQuizFormChange}
                    placeholder="Enter your question here..."
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      minHeight: "80px",
                      resize: "vertical"
                    }}
                  />
                </div>

                {quizForm.type === "mcq" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                      Answer Options:
                    </label>
                    {quizForm.options?.map((option, index) => (
                      <div key={index} style={{ marginBottom: "0.5rem" }}>
                        <input
                          type="text"
                          name={`option-${index}`}
                          value={option}
                          onChange={handleQuizFormChange}
                          placeholder={`Option ${index + 1}`}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    Correct Answer:
                  </label>
                  {quizForm.type === "mcq" ? (
                    <select
                      name="correctAnswer"
                      value={quizForm.correctAnswer}
                      onChange={handleQuizFormChange}
                      required
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                    >
                      <option value="">Select the correct answer</option>
                      {quizForm.options?.filter(opt => opt.trim()).map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="correctAnswer"
                      value={quizForm.correctAnswer}
                      onChange={handleQuizFormChange}
                      placeholder="Enter the correct answer"
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc"
                      }}
                    />
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {editingQuizId ? "Update Question" : "Add Question"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuizForm(false);
                      setEditingQuizId(null);
                      setQuizForm({
                        type: "mcq",
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                      });
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quiz Questions List */}
          {quizzes.length === 0 ? (
            <p style={{ color: "#6c757d", fontStyle: "italic" }}>
              No quiz questions yet. Add your first question to get started!
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#fff"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <span style={{
                          backgroundColor: quiz.type === "mcq" ? "#17a2b8" : "#28a745",
                          color: "white",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "bold"
                        }}>
                          {quiz.type === "mcq" ? "MCQ" : "TEXT"}
                        </span>
                        <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                          Question {index + 1}
                        </span>
                      </div>
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
                        {quiz.question}
                      </h4>
                      {quiz.type === "mcq" && quiz.options && (
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong style={{ fontSize: "0.9rem", color: "#6c757d" }}>Options:</strong>
                          <ul style={{ margin: "0.25rem 0", paddingLeft: "1.5rem" }}>
                            {quiz.options.map((option, optIndex) => (
                              <li
                                key={optIndex}
                                style={{
                                  color: option === quiz.correctAnswer ? "#28a745" : "#495057",
                                  fontWeight: option === quiz.correctAnswer ? "bold" : "normal"
                                }}
                              >
                                {option} {option === quiz.correctAnswer && "✓"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                        <strong>Correct Answer:</strong> {quiz.correctAnswer}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          backgroundColor: "#ffc107",
                          color: "#212529",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id!)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quiz Preview */}
          <QuizPreview questions={quizzes} />
        </div>
      )}
    </AdminLayout>
  );
}
