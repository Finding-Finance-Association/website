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
    })
    const fetchCourses = async () => {
        const querySnapshot = await getDocs(collection(db,"courses_coll"));
        const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Course[];
        setCourses(data);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: name === "hours" ? Number(value) : value}))
    }

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
    <div style={{ padding: 20 }}>
      <h1>Admin - Manage Courses</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="thumbnail" placeholder="Thumbnail URL" value={form.thumbnail} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="hours" type="number" placeholder="Hours" value={form.hours} onChange={handleChange} required />
        <button type="submit">Add Course</button>
      </form>


      <h2>Existing Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id} style={{ marginBottom: 10 }}>
            <strong>{course.title}</strong> - {course.category} - {course.hours} hrs
            <Link href={`/admin/courses/${course.id}/modules`}>Manage Modules</Link>
            <button onClick={() => handleDelete(course.id!)} style={{ marginLeft: 5 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    )
}