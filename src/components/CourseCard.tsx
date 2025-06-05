"use client";
import Link from "next/link";
import { Course } from "@/lib/mockData";
import { motion } from "framer-motion";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 space-y-2">
        {/* <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
          Free Course
        </span> */}
        <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
        <p className="text-gray-600 text-sm">{course.description}</p>
        <Link href={`/courses/${course.id}`}>
          <button className="mt-3 inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition font-medium">
            View Course
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
