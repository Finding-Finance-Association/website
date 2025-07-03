"use client";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/mockData";
import { motion } from "framer-motion";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Optional Badge */}
        {/* <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
      Free Course
    </span> */}

        <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {course.description}
        </p>

        <div className="mt-auto">
          <Link href={`/courses/${course.id}`}>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition font-medium">
              View Course
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
