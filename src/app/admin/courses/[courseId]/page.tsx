"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

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
  order: number;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [form, setForm] = useState<Module>({
    title: "",
    outcome: "",
    hasQuiz: false,
    order: 1,
  });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Course | null>(null);

  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      if (!courseId) return;

      setLoadingCourse(true);
      setLoadingModules(true);
      setError(null);

      try {
        const courseRef = doc(
          db,
          "courses_coll",
          Array.isArray(courseId) ? courseId[0] : courseId
        );
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data() as Course);
        } else {
          setError("Course not found");
          setCourse(null);
        }

        const modulesRef = collection(courseRef, "modules");
        const modulesSnap = await getDocs(modulesRef);
        const mods = modulesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Module[];

        // Sort modules by order
        const sortedMods = mods.sort((a, b) => (a.order || 0) - (b.order || 0));
        setModules(sortedMods);

        // Set default order for new module
        setForm((prev) => ({ ...prev, order: sortedMods.length + 1 }));
      } catch (err) {
        setError("Failed to load course or modules.");
        console.error(err);
      } finally {
        setLoadingCourse(false);
        setLoadingModules(false);
      }
    };
    fetchCourseAndModules();
  }, [courseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "order") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setAddingModule(true);
    setError(null);

    try {
      const modulesRef = collection(
        doc(
          db,
          "courses_coll",
          Array.isArray(courseId) ? courseId[0] : courseId
        ),
        "modules"
      );
      const newModuleRef = await addDoc(modulesRef, form);
      const newModule = { ...form, id: newModuleRef.id };
      setModules((prev) =>
        [...prev, newModule].sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      setForm({
        title: "",
        outcome: "",
        hasQuiz: false,
        order: modules.length + 1,
      });
    } catch (err) {
      setError("Failed to add module.");
      console.error(err);
    } finally {
      setAddingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!courseId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this module and all its content?"
    );
    if (!confirmed) return;

    setDeletingModuleId(moduleId);
    setError(null);

    try {
      const moduleRef = doc(
        db,
        "courses_coll",
        String(courseId),
        "modules",
        moduleId
      );

      const contentBlocksRef = collection(moduleRef, "contentBlocks");
      const contentSnap = await getDocs(contentBlocksRef);
      const deleteBlockPromises = contentSnap.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
      );
      await Promise.all(deleteBlockPromises);

      await deleteDoc(moduleRef);

      setModules((prev) => prev.filter((mod) => mod.id !== moduleId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete module and its content blocks.");
    } finally {
      setDeletingModuleId(null);
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !editForm) return;
    setSavingCourse(true);
    setError(null);

    try {
      const courseRef = doc(
        db,
        "courses_coll",
        Array.isArray(courseId) ? courseId[0] : courseId
      );
      await setDoc(courseRef, editForm);
      setCourse(editForm);
      setEditMode(false);
    } catch (err) {
      setError("Failed to save course.");
      console.error(err);
    } finally {
      setSavingCourse(false);
    }
  };

  return (
    <AdminLayout
      courseTitle={course?.title}
      courseId={courseId as string}
      pageTitle={course?.title || "Course Details"}
      pageDescription="Manage course information and modules. Add new modules or edit existing ones."
    >
      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          <strong>Error: </strong>
          {error}
        </p>
      )}

      {loadingCourse ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              width: "1.5rem",
              height: "1.5rem",
              border: "3px solid #ccc",
              borderTop: "3px solid #0070f3",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 1s linear infinite",
            }}
          />
          <span>Loading course...</span>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}</style>
        </div>
      ) : (
        <>
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
              <Image
                src={course.thumbnail}
                alt="Course thumbnail"
                width={200}
                height={100}
              />
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setEditForm(course);
                  }}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
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
              <h2
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                Edit Course
              </h2>
              <label style={{ fontWeight: "bold" }}> Title</label>
              <input
                name="title"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />
              <label style={{ fontWeight: "bold" }}> Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
                rows={4}
              />
              <label style={{ fontWeight: "bold" }}> Thumbnail URL</label>
              <input
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={editForm.thumbnail}
                onChange={(e) =>
                  setEditForm({ ...editForm, thumbnail: e.target.value })
                }
                required
              />
              <label style={{ fontWeight: "bold" }}> Category</label>
              <input
                name="category"
                placeholder="Category"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                required
              />
              <label style={{ fontWeight: "bold" }}> Hours to complete</label>
              <input
                name="hours"
                type="number"
                placeholder="Hours"
                value={editForm.hours}
                min={0}
                onChange={(e) =>
                  setEditForm({ ...editForm, hours: Number(e.target.value) })
                }
                required
              />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={savingCourse}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: savingCourse ? "#6c757d" : "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingCourse ? "not-allowed" : "pointer",
                  }}
                >
                  {savingCourse ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  disabled={savingCourse}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingCourse ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
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
        <label style={{ fontWeight: "bold" }}>Title</label>
        <input
          name="title"
          placeholder="Module Title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={addingModule}
        />
        <label style={{ fontWeight: "bold" }}>Outcome</label>
        <textarea
          name="outcome"
          placeholder="Outcome"
          value={form.outcome}
          onChange={handleChange}
          required
          rows={3}
          disabled={addingModule}
        />
        <label style={{ fontWeight: "bold" }}>Order</label>
        <input
          name="order"
          type="number"
          placeholder="Order (1, 2, 3...)"
          value={form.order}
          onChange={handleChange}
          required
          min={1}
          disabled={addingModule}
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            name="hasQuiz"
            checked={form.hasQuiz}
            onChange={handleChange}
            disabled={addingModule}
          />
          Has Quiz
        </label>
        <button
          type="submit"
          disabled={addingModule}
          style={{
            padding: "0.5rem",
            backgroundColor: addingModule ? "#6c757d" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: addingModule ? "not-allowed" : "pointer",
          }}
        >
          {addingModule ? "Adding..." : "Add Module"}
        </button>
      </form>

      <h2 style={{ marginBottom: "1rem" }}>Modules</h2>

      {loadingModules ? (
        <p>Loading modules...</p>
      ) : modules.length === 0 ? (
        <p>No modules yet.</p>
      ) : (
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
                <h3 style={{ margin: 0 }}>
                  <span
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    #{mod.order || 0}
                  </span>
                  {mod.title}
                </h3>
                <p style={{ margin: "0.25rem 0" }}>
                  <strong>Outcome:</strong> {mod.outcome}{" "}
                  {mod.hasQuiz && "· Has Quiz"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/admin/courses/${courseId}/modules/${mod.id}`}>
                  <button
                    style={{
                      padding: "0.4rem 0.75rem",
                      backgroundColor: "#17a2b8",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit Module
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteModule(mod.id!)}
                  disabled={deletingModuleId === mod.id}
                  style={{
                    padding: "0.4rem 0.75rem",
                    backgroundColor:
                      deletingModuleId === mod.id ? "#6c757d" : "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      deletingModuleId === mod.id ? "not-allowed" : "pointer",
                  }}
                >
                  {deletingModuleId === mod.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}
