"use client";
import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation"
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

export default function CourseDetailPage(){
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [form, setForm] = useState<Module>({title: "", outcome: "", hasQuiz: false});

    useEffect(() => {
        const fetchCourseAndModules = async () => {
            if (!courseId) return;

            const courseRef = doc(db, "courses_coll",courseId as string);
            const courseSnap = await getDoc(courseRef);
            if (courseSnap.exists()){
                setCourse(courseSnap.data() as Course);

            }

            const modulesRef = collection(courseRef,"modules");
            const modulesSnap = await getDocs(modulesRef);
            const mods = modulesSnap.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Module[];
            setModules(mods)
        };
        fetchCourseAndModules();
    },[courseId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setForm((prev) => ({...prev, [name]: type === "checkbox" ? checked : value}) )
    }

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();

        const modulesRef = collection(doc(db,"courses_coll", courseId as string), "modules")
        const newModuleRef = await addDoc(modulesRef, form);
        const newModule = {...form, id: newModuleRef.id}
        setModules((prev) => [...prev,newModule]);
        setForm({ title: "", outcome: "", hasQuiz: false });

    }

    const handleDeleteModule = async (moduleId: string) => {
        await deleteDoc(doc(db,"courses_coll",courseId as string, "modules", moduleId));
        setModules((prev) => prev.filter((mod) => mod.id !== moduleId));
    }
    return (
    <div style={{ padding: 20 }}>
      <h1>Course Detail</h1>
      {course && (
        <div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Hours:</strong> {course.hours}</p>
          <img src={course.thumbnail} alt="Course thumbnail" style={{ width: 200 }} />
        </div>
      )}

      <h2>Add New Module</h2>
      <form onSubmit={handleAddModule} style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <input name="title" placeholder="Module Title" value={form.title} onChange={handleChange} required />
        <input name="outcome" placeholder="Outcome" value={form.outcome} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="hasQuiz" checked={form.hasQuiz} onChange={handleChange} /> Has Quiz
        </label>
        <button type="submit">Add Module</button>
      </form>

      <h2>Modules</h2>
      <ul>
        {modules.map((mod) => (
          <li key={mod.id}>
            <strong>{mod.title}</strong> - {mod.outcome} {mod.hasQuiz && "(Has Quiz)"}
            {mod.id && (
              <>
                {" "}- <Link href={`/admin/courses/${courseId}/modules/${mod.id}`}>Edit Module</Link>
                {" "}- <button onClick={() => handleDeleteModule(mod.id!)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    )
}