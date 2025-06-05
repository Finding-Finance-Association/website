"use client";
import { getCourses } from "@/lib/mockData";
import CourseCard from "@/components/CourseCard";
import { useState } from "react";
import Header from "@/components/Header";
import { FiSearch } from "react-icons/fi";

export default function CoursesPage() {
  const allCourses = getCourses();
  const [search, setSearch] = useState("");

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="px-4 sm:px-8 md:px-16 py-12 bg-gradient-to-br from-white to-gray-100 min-h-screen">
        {/* Animated Finance Gradient Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 bg-[size:200%] animate-gradient text-white p-8 rounded-xl mb-10 text-center shadow-lg">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Explore Our Courses
            </h1>
            <p className="text-lg text-emerald-50">
              Master Your Financial Future with Expert-Led Courses
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 text-6xl">$</div>
            <div className="absolute top-1/4 right-1/4 transform -translate-y-1/2 text-6xl">₿</div>
            <div className="absolute bottom-1/4 left-1/3 transform -translate-y-1/2 text-6xl">📈</div>
          </div>
        </section>

        {/* Animated Search bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search for courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all duration-300"
          />
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </>
  );
}
