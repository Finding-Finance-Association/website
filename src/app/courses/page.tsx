"use client";
import CourseCard, { Course } from "@/components/CourseCard";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Footer from "@/components/Footer";
import TitleCard from "@/components/TitleCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingPage } from "@/components/LoadingPage";
import Link from "next/link";

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"all" | "my">("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowCourses(true), 600);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/courses");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.err || "Server Error");
        }
        const data = await res.json();
        setAllCourses(data);
      } catch (error: unknown) {
        console.log(error instanceof Error ? error.message : "Unexpected Error");
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async (userId: string) => {
      try {
        const res = await fetch(`/api/users/enrollments?userId=${userId}`);
        if (res.ok) {
          const { enrolledCourseIds } = await res.json();
          setEnrolledCourseIds(enrolledCourseIds || []);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      await fetchCourses();
      if (user) {
        setUserLoggedIn(true);
        await fetchEnrolledCourses(user.uid);
      } else {
        setUserLoggedIn(false);
        setEnrolledCourseIds([]);
        setView("all");            
        setShowLoginPrompt(false); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const myCourses = allCourses.filter((c) => enrolledCourseIds.includes(c.id));

  // Single grid: base list by toggle, then search
  const baseCourses = view === "my" ? myCourses : allCourses;
  const filteredCourses = baseCourses.filter((course) => {
    const q = search.toLowerCase();
    return (
      course.title.toLowerCase().includes(q) ||
      course.description?.toLowerCase().includes(q)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Header />
          <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
            <TitleCard
              title1="Master Your"
              title2="Financial Future"
              subtext="Transform your relationship with money through expert-designed courses that deliver real-world results and lasting financial confidence."
            />

            {/* Search + Toggle */}
            <section className="w-5/6 mx-auto pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {/* Search */}
                  <div className="relative flex-1 w-full">
                    <motion.div
                      animate={{ scale: isSearchFocused ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <FiSearch
                        className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 ${
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

                  {/* Toggle */}
                  <div className="w-full lg:w-auto">
                    <div className="relative inline-flex bg-gray-100 rounded-xl p-1 select-none">
                      <motion.div
  layout
  layoutId="view-pill"
  className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow transition-all duration-300"
  animate={{ left: view === "all" ? "0%" : "50%" }}
  transition={{ type: "spring", stiffness: 500, damping: 35 }}
/>
                      <button
                        type="button"
                        onClick={() => {
                          setView("all");
                          setShowLoginPrompt(false);
                        }}
                        aria-pressed={view === "all"}
                        className={`relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          view === "all" ? "text-slate-900" : "text-gray-500"
                        }`}
                      >
                        All Courses
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!userLoggedIn) setShowLoginPrompt(true);
                          else setView("my");
                        }}
                        aria-pressed={view === "my"}
                        className={`relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          view === "my" ? "text-slate-900" : "text-gray-500"
                        }`}
                      >
                        My Courses
                      </button>
                    </div>

                    {/* Login prompt */}
                    {showLoginPrompt && (
                      <div className="mt-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                        You need to{" "}
                        <Link href="/login" className="underline text-emerald-600 hover:text-emerald-700">
                          log in
                        </Link>{" "}
                        to view your courses.
                        <button
                          onClick={() => setShowLoginPrompt(false)}
                          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                          aria-label="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Count */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600"
                  >
                    {search ? (
                      <span>
                        {filteredCourses.length} course
                        {filteredCourses.length !== 1 ? "s" : ""} found in{" "}
                        {view === "my" ? "My Courses" : "All Courses"} for &quot;{search}&quot;
                      </span>
                    ) : (
                      <span>
                        Showing {filteredCourses.length} in {view === "my" ? "My Courses" : "All Courses"}
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* Single Courses Section (no separate My Courses block) */}
            {showCourses && (
              <section className="w-5/6 mx-auto py-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {search ? "Search Results" : view === "my" ? "My Courses" : "Explore All Courses"}
                </h2>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${view}-${search}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <motion.div key={course.id} variants={itemVariants} layout>
                          <CourseCard course={course} enrolled={enrolledCourseIds.includes(course.id)} />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full space-y-4 flex flex-col items-center justify-center py-10 text-center"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <FiSearch className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-700">No courses found</h3>
                        <p className="text-slate-400 w-2/3 mx-auto">
                          We couldn&apos;t find any courses matching your search criteria. Try adjusting your filters or
                          search terms.
                        </p>
                        <motion.button
                          onClick={() => setSearch("")}
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
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
