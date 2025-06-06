"use client";
import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "@/lib/mockData";
import { useUser } from "@/lib/useUser";
import ModuleList from "@/components/ModuleList";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiCheck,
  FiClock,
  FiUsers,
  FiStar,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiChevronLeft,
  FiShare2,
  FiHeart,
  FiMenu,
  FiX,
  FiPlayCircle,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import QuizComponent from "@/components/QuizComponent";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const course = getCourseById(courseId);
  const user = useUser();
  const [enrolled, setEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeTab, setActiveTab] = useState<"lesson" | "quiz">("lesson");

  useEffect(() => {
    if (!course) return;
    setEnrolled(user.isEnrolled(courseId));
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FiBookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/courses"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user.userId) {
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    user.enrolledCourseIds.push(courseId);
    setEnrolled(true);
    setIsEnrolling(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Mock data for demonstration
  const courseStats = {
    completionRate: "94%",
    certificate: true,
    hours: course.hours,
  };

  // If enrolled, show learning interface
  if (enrolled) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h1 className="font-semibold text-gray-900 text-lg truncate max-w-md">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Module {activeModule + 1} of {course.modules.length}
                </p>
              </div>
            </div>

            

            <div className="flex items-center gap-3">
              {/* Progress Bar */}
              {/* <div className="text-sm text-gray-600">Progress: 85%</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-16 h-2 bg-emerald-500 rounded-full"></div>
              </div> */}
              <button
                onClick={handleGoBack}
                className="bg-slate-200 text-black hover:text-emerald-600 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                Exit
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Course Navigation */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-80 bg-white border-r border-gray-200 flex flex-col"
                >
                  {/* Course Progress Summary */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Course Progress
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>3 of 8 modules completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Module Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="space-y-1">
                          <button
                            onClick={() => {
                              setActiveModule(moduleIndex);
                              setActiveTab("lesson");
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              activeModule === moduleIndex
                                ? "bg-emerald-50 border border-emerald-200"
                                : "hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  moduleIndex < 3
                                    ? "bg-emerald-100 text-emerald-600"
                                    : activeModule === moduleIndex
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {moduleIndex < 3 ? (
                                  <FiCheck className="w-4 h-4" />
                                ) : (
                                  moduleIndex + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                  {module.title}
                                </h4>
                                {/* <p className="text-xs text-gray-500">
                                  {module.lessons?.length || 3} lessons • {module.duration || '45m'}
                                </p> */}
                              </div>
                            </div>
                          </button>

                          {/* Lessons for active module */}
                          {activeModule === moduleIndex && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="ml-4 space-y-1 overflow-hidden"
                            >
                              {/* Mock lessons */}
                              {[
                                {
                                  title: "Introduction to the Topic",
                                  type: "video",
                                  duration: "15m",
                                },
                                {
                                  title: "Key Concepts",
                                  type: "video",
                                  duration: "20m",
                                },
                              ].map((lesson, lessonIndex) => (
                                <button
                                  key={lessonIndex}
                                  onClick={() => setActiveLesson(lessonIndex)}
                                  className={`w-full text-left p-2 pl-8 rounded-lg text-sm transition-colors ${
                                    activeLesson === lessonIndex
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {lesson.type === "video" ? (
                                      <FiPlayCircle className="w-4 h-4" />
                                    ) : (
                                      <FiFileText className="w-4 h-4" />
                                    )}
                                    <span className="truncate">
                                      {lesson.title}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                      {lesson.duration}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}

                      {course.quizzes?.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                          <button
                            onClick={() => setActiveTab("quiz")}
                            className={`w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-lg text-left transition-all duration-200 ${
                              activeTab === "quiz"
                                ? "border-blue-400"
                                : "border-blue-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiAward className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  Final Quiz
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Test your knowledge
                                </p>
                              </div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                <motion.div
                  key={
                    activeTab === "quiz"
                      ? "quiz"
                      : `${activeModule}-${activeLesson}`
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  {activeTab === "quiz" ? (
                    <QuizComponent
                      questions={course.quizzes}
                      isEnrolled={enrolled}
                      onSubmit={(results) => {
                        console.log("Quiz completed:", results);
                      }}
                    />
                  ) : (
                    <>
                      {/* Video/Content Player */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
                          <div className="text-center text-white">
                            <FiPlayCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-medium mb-2">
                              Module {activeModule + 1}, Lesson{" "}
                              {activeLesson + 1}
                            </h3>
                            <p className="text-gray-300">
                              {activeLesson === 0
                                ? "Introduction to the Topic"
                                : activeLesson === 1
                                ? "Key Concepts"
                                : "Practice Exercise"}
                            </p>
                          </div>
                          <button className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                            <FiPlay className="w-12 h-12 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Lesson Content */}
                      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {course.modules[activeModule]?.title} - Lesson{" "}
                          {activeLesson + 1}
                        </h2>
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed mb-4">
                            This is the main content area where lesson
                            materials, transcripts, notes, and interactive
                            elements would be displayed. The content changes
                            based on the selected module and lesson.
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            Students can take notes, access downloadable
                            resources, and interact with embedded quizzes and
                            exercises here.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Original course details view for non-enrolled users
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <motion.button
            onClick={handleGoBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors duration-300 mb-6"
          >
            <FiChevronLeft className="mr-2" />
            Back to Courses
          </motion.button>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-600 text-white p-8 sm:p-12 rounded-2xl shadow-2xl shadow-emerald-500/20 mb-8 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 text-6xl">📚</div>
                    <div className="absolute bottom-4 left-4 text-6xl">💡</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
                      $
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                      {course.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-emerald-100">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-5 h-5" />
                        <span>{courseStats.hours} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiAward className="w-5 h-5" />
                        <span>Certificate included</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Course
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <p
                      className={`${
                        !showFullDescription ? "line-clamp-3" : ""
                      }`}
                    >
                      {course.description}
                    </p>
                    {course.description.length > 200 && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-emerald-600 hover:text-emerald-700 font-medium mt-2 transition-colors duration-300"
                      >
                        {showFullDescription ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </motion.section>

                {/* Course Modules */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Course Content
                  </h3>
                  <ModuleList
                    courseId={courseId}
                    modules={course.modules}
                    isEnrolled={enrolled}
                  />
                  {course.quizzes?.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
                        Final Quiz
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-600 text-center">
                          Complete the course modules to unlock the final quiz
                        </p>
                      </div>
                    </>
                  )}
                </motion.section>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                  {/* Enrollment Status */}
                  <div className="text-center mb-6">
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {"Free"}
                      </div>
                    </div>

                    <motion.button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      whileHover={{ scale: isEnrolling ? 1 : 1.02 }}
                      whileTap={{ scale: isEnrolling ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isEnrolling ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <FiBookOpen className="w-5 h-5" />
                          Enroll Now
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Course Highlights */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      What You'll Get:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Lifetime access to course materials</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Access to private community</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Expert instructor support</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Mobile and desktop access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
