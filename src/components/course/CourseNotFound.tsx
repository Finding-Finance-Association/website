import { motion } from "framer-motion";
import Link from "next/link";
import { FiBookOpen, FiChevronLeft } from "react-icons/fi";
import Header from "../Header";

export default function CourseNotFound() {
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FiBookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            The course you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back to Courses
          </Link>
        </motion.div>
      </div>
    </>
  );
}
