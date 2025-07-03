"use client";
import { getCourses } from "@/lib/mockData";
import CourseCard from "@/components/CourseCard";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Footer from "@/components/Footer";
import TitleCard from "@/components/TitleCard";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  hours?: number;
};

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCourses, setShowCourses] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCourses(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.err || "Server Error");
        }
        const data = await res.json();
        setAllCourses(data);
        console.log("courses data : ", data);
      } catch (error: any) {
        console.log(error.message || "Unexpected Error");
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <TitleCard
          title1="Master Your"
          title2="Financial Future"
          subtext="Transform your relationship with money through expert-designed courses that deliver real-world results and lasting financial confidence."
        />

        {/* Search and Filter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <motion.div
                  animate={{
                    scale: isSearchFocused ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <FiSearch
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${
                      isSearchFocused ? "text-emerald-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search courses, topics, or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                </motion.div>
              </div>

              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600"
              >
                {search ? (
                  <span>
                    {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? "s" : ""} found
                    {search && ` for "${search}"`}
                  </span>
                ) : (
                  <span>Showing all {allCourses.length} courses</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Courses Grid */}
        {showCourses && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${search}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <motion.div key={course.id} variants={itemVariants} layout>
                      <CourseCard course={course} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <FiSearch className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      We couldn&apos;t find any courses matching your search
                      criteria. Try adjusting your filters or search terms.
                    </p>
                    <motion.button
                      onClick={() => {
                        setSearch("");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-300"
                    >
                      Clear Filters
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        <Footer/>
      </main>
    </>
  );
}
