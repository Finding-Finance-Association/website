"use client";
import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "@/lib/mockData";
import { useUser } from "@/lib/useUser";
import ModuleList from "@/components/ModuleList";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const course = getCourseById(courseId);
  const user = useUser();
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!course) return;
    setEnrolled(user.isEnrolled(courseId));
  }, [courseId]);

  if (!course) return <div className="p-6">Course not found.</div>;

  const handleEnroll = () => {
    if (!user.userId) {
      router.push("/login");
    } else {
      // Simulate enroll API call
      user.enrolledCourseIds.push(courseId);
      setEnrolled(true);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 sm:px-8 md:px-16 py-24 bg-gradient-to-br from-white to-gray-100 min-h-screen">
        {/* Banner */}
        <section className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-10 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold">{course.title}</h1>
        </section>

        {/* Overview */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Course Overview</h2>
          <p className="text-gray-700">{course.description}</p>
        </section>

        {/* Enroll button + status */}
        <div className="mb-6">
          {enrolled ? (
            <>
              <p className="text-green-700 font-medium mb-2">✅ You are enrolled in this course!</p>
              <Link href={`/courses/${courseId}/learn`}>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
                  Continue Learning
                </button>
              </Link>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleEnroll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition font-medium shadow"
            >
              Enroll Now
            </motion.button>
          )}
        </div>

        {/* Modules */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Modules</h3>
          <ModuleList
            courseId={courseId}
            modules={course.modules}
            isEnrolled={enrolled}
          />
        </section>
      </main>
    </>
  );
}
