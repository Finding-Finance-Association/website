"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiLayers,
  FiChevronRight,
} from "react-icons/fi";

interface AdminNavbarProps {
  courseTitle?: string;
  moduleTitle?: string;
  courseId?: string;
  moduleId?: string;
}

export default function AdminNavbar({
  courseTitle,
  moduleTitle,
  courseId,
  moduleId,
}: AdminNavbarProps) {
  const pathname = usePathname();

  // Determine current page for highlighting
  const isCoursesPage = pathname === "/admin/courses";
  const isCourseDetailPage = pathname === `/admin/courses/${courseId}`;
  const isModuleDetailPage =
    pathname === `/admin/courses/${courseId}/modules/${moduleId}`;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiBook className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Course Admin
              </span>
            </Link>
            <Link
              href="/"
              className="text-red-800 bg-amber-400 opacity-65 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-100"
            >
              Home Page
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 text-sm">
            {/* Home */}
            <Link
              href="/admin/courses"
              className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                isCoursesPage
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FiHome className="w-4 h-4" />
              <span>All Courses</span>
            </Link>

            {/* Course Level */}
            {courseId && (
              <>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href={`/admin/courses/${courseId}`}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                    isCourseDetailPage
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FiBook className="w-4 h-4" />
                  <span>{courseTitle || "Course Details"}</span>
                </Link>
              </>
            )}

            {/* Module Level */}
            {moduleId && (
              <>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                    isModuleDetailPage
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <FiLayers className="w-4 h-4" />
                  <span>{moduleTitle || "Module Content"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
