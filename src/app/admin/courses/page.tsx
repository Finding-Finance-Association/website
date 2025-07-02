"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Course {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  hours: number;
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Course>({
    title: "",
    description: "",
    thumbnail: "",
    category: "",
    hours: 0,
  });

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses_coll"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Course[];
    setCourses(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "hours" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "courses_coll"), form);
    setForm({ title: "", description: "", thumbnail: "", category: "", hours: 0 });
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "courses_coll", id));
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Admin - Manage Courses</h1>

      <form
        onSubmit={handleSubmit}
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
        <h2 style={{ marginBottom: "0.5rem" }}>Add New Course</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="thumbnail" placeholder="Thumbnail URL" value={form.thumbnail} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="hours" type="number" placeholder="Hours" value={form.hours} onChange={handleChange} required />
        <button type="submit" style={{ padding: "0.5rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}>
          Add Course
        </button>
      </form>

      <h2 style={{ marginBottom: "1rem" }}>Existing Courses</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {courses.map((course) => (
          <li
            key={course.id}
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
              <h3 style={{ margin: 0 }}>{course.title}</h3>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Category:</strong> {course.category} &nbsp;|&nbsp; <strong>Hours:</strong> {course.hours}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href={`/admin/courses/${course.id}`}>
                <button style={{ padding: "0.4rem 0.75rem", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
                  Manage Modules
                </button>
              </Link>
              <button
                onClick={() => handleDelete(course.id!)}
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
