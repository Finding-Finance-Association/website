"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Course {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  hours: number;
}

interface Module {
  id?: string;
  title: string;
  outcome: string;
  hasQuiz: boolean;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [form, setForm] = useState<Module>({ title: "", outcome: "", hasQuiz: false });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      if (!courseId) return;

      const courseRef = doc(db, "courses_coll", courseId as string);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse(courseSnap.data() as Course);
      }

      const modulesRef = collection(courseRef, "modules");
      const modulesSnap = await getDocs(modulesRef);
      const mods = modulesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Module[];
      setModules(mods);
    };
    fetchCourseAndModules();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const modulesRef = collection(doc(db, "courses_coll", courseId as string), "modules");
    const newModuleRef = await addDoc(modulesRef, form);
    const newModule = { ...form, id: newModuleRef.id };
    setModules((prev) => [...prev, newModule]);
    setForm({ title: "", outcome: "", hasQuiz: false });
  };

  const handleDeleteModule = async (moduleId: string) => {
    await deleteDoc(doc(db, "courses_coll", courseId as string, "modules", moduleId));
    setModules((prev) => prev.filter((mod) => mod.id !== moduleId));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseRef = doc(db, "courses_coll", courseId as string);
    await setDoc(courseRef, editForm!);
    setCourse(editForm);
    setEditMode(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Course Detail</h1>

      {!editMode && course && (
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "2rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>
            <strong>Category:</strong> {course.category} &nbsp;|&nbsp;
            <strong>Hours:</strong> {course.hours}
          </p>
          <img src={course.thumbnail} alt="Course thumbnail" style={{ width: "200px", marginTop: "1rem", borderRadius: "4px" }} />
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => {
                setEditMode(true);
                setEditForm(course);
              }}
              style={{ padding: "0.5rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              Edit Course
            </button>
          </div>
        </div>
      )}

      {editMode && editForm && (
        <form
          onSubmit={handleEditFormSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "2rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <input name="title" placeholder="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
          <textarea name="description" placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          <input name="thumbnail" placeholder="Thumbnail URL" value={editForm.thumbnail} onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })} />
          <input name="category" placeholder="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
          <input name="hours" type="number" placeholder="Hours" value={editForm.hours} onChange={(e) => setEditForm({ ...editForm, hours: Number(e.target.value) })} />
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

      <h2 style={{ marginBottom: "0.5rem" }}>Add New Module</h2>
      <form
        onSubmit={handleAddModule}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "2rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        <input name="title" placeholder="Module Title" value={form.title} onChange={handleChange} required />
        <input name="outcome" placeholder="Outcome" value={form.outcome} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="hasQuiz" checked={form.hasQuiz} onChange={handleChange} /> Has Quiz
        </label>
        <button type="submit" style={{ padding: "0.5rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}>
          Add Module
        </button>
      </form>

      <h2 style={{ marginBottom: "1rem" }}>Modules</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {modules.map((mod) => (
          <li
            key={mod.id}
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
            <div>
              <h3 style={{ margin: 0 }}>{mod.title}</h3>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Outcome:</strong> {mod.outcome} {mod.hasQuiz && "· Has Quiz"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href={`/admin/courses/${courseId}/modules/${mod.id}`}>
                <button style={{ padding: "0.4rem 0.75rem", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px" }}>
                  Edit Module
                </button>
              </Link>
              <button
                onClick={() => handleDeleteModule(mod.id!)}
                style={{ padding: "0.4rem 0.75rem", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
