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
  FiBookOpen,
  FiAward,
  FiChevronLeft,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiTarget,
  FiDownload,
} from "react-icons/fi";
import QuizComponent from "@/components/QuizComponent";
import ReactMarkdown from "react-markdown";

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

  const [completedModules, setCompletedModules] = useState<Set<number>>(
    new Set([0, 1])
  );

  const [userInput, setUserInput] = useState<Record<string, string>>({});

  // Function to handle the textarea input change
  const handleInputChange = (
    blockId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserInput((prev) => ({
      ...prev,
      [blockId]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!course) return;
    setEnrolled(user.isEnrolled(courseId));
  }, [courseId, user, course]);

  if (!course) {
    return (
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
    );
  }

  const handleEnroll = async () => {
    if (!user.userId) {
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    user.enrolledCourseIds.push(courseId);
    setEnrolled(true);
    setIsEnrolling(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const toggleModuleCompletion = (moduleIndex: number) => {
    setCompletedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleIndex)) {
        newSet.delete(moduleIndex);
      } else {
        newSet.add(moduleIndex);
      }
      return newSet;
    });
  };

  // Course statistics
  const courseStats = {
    completionRate: "94%",
    certificate: true,
    hours: course.hours || 8,
    students: "2,341",
    rating: 4.8,
    reviews: 156,
  };

  const progressPercentage = Math.round(
    (completedModules.size / course.modules.length) * 100
  );

  // If enrolled, show learning interface
  if (enrolled) {
    const currentModule = course.modules[activeModule];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm"
        >
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
                Module {activeModule + 1} of {course.modules.length} •{" "}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {progressPercentage}%
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                />
              </div>
            </div>
            <button
              onClick={handleGoBack}
              className="bg-gray-100 text-gray-700 hover:text-emerald-600 hover:bg-gray-200 transition-all px-4 py-2 rounded-lg font-medium"
            >
              Exit Course
            </button>
          </div>
        </motion.div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Course Navigation */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm"
              >
                {/* Course Progress Summary */}
                <div className="p-6 border-b border-gray-100">
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Your Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium text-gray-900">
                          {completedModules.size} of {course.modules.length}{" "}
                          modules
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    {course.modules.map((module, moduleIndex) => {
                      const isCompleted = completedModules.has(moduleIndex);
                      const isActive = activeModule === moduleIndex;

                      return (
                        <div key={moduleIndex} className="space-y-1">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                              setActiveModule(moduleIndex);
                              setActiveTab("lesson");
                              setActiveLesson(0);
                            }}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-50 border-2 border-emerald-200 shadow-sm"
                                : "hover:bg-gray-50 border-2 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                  isCompleted
                                    ? "bg-emerald-100 text-emerald-600"
                                    : isActive
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isCompleted ? (
                                  <FiCheck className="w-4 h-4" />
                                ) : (
                                  moduleIndex + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                  {module.title}
                                </h4>
                                {/* <p className="text-xs text-gray-500 mt-1">
                                  {module.contentType}
                                </p> */}
                                {module.outcome && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FiTarget className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs text-gray-400 truncate">
                                      {module.outcome}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleModuleCompletion(moduleIndex);
                                }}
                                className={`p-1 rounded-full transition-colors ${
                                  isCompleted
                                    ? "text-emerald-600 hover:bg-emerald-100"
                                    : "text-gray-400 hover:bg-gray-100"
                                }`}
                              >
                                <FiCheckCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>

                          {/* Quiz Button and Lessons */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 space-y-2 overflow-hidden"
                              >
                                {/* Quiz Button */}
                                {module.contentType === "quiz" && (
                                  <button
                                    onClick={() => setActiveTab("quiz")}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                                      activeTab === "quiz"
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <FiCheckCircle className="w-4 h-4" />
                                      <span>Module Quiz</span>
                                    </div>
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
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
                      if (results.score === results.totalQuestions) {
                        toggleModuleCompletion(activeModule);
                      }
                    }}
                  />
                ) : (
                  <>
                    {/* Content Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>Module {activeModule + 1}</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentModule?.title}
                      </h2>
                    </div>
                    {/* {currentModule?.contentType === "video" && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative group flex items-center justify-center">
                    
                          <button className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-all duration-300 flex items-center justify-center group-hover:bg-black/40">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiPlay className="w-16 h-16 text-white drop-shadow-lg" />
                            </motion.div>
                          </button>

                          <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 mt-4 text-center text-white z-10">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h3 className="text-2xl font-medium mb-1">
                                {currentModule?.title}
                              </h3>
                              <p className="text-gray-300 text-lg">
                                Video Lesson
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )} */}
                    {/* Lesson Content */}
                    <div className="space-y-6">
                      {currentModule?.contentBlocks?.map((block, idx, arr) => {
                        if (
                          block.type === "markdown" &&
                          arr[idx + 1]?.type === "list"
                        ) {
                          const listBlock = arr[idx + 1];
                          return (
                            <div
                              key={block.id}
                              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            >
                              {/* Render the markdown block */}
                              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 mb-4">
                                <ReactMarkdown
                                  components={{
                                    h3: ({ children }) => (
                                      <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">
                                        {children}
                                      </h3>
                                    ),
                                    p: ({ children }) => (
                                      <p className="text-gray-700 leading-relaxed mb-4">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="space-y-2 mb-4">
                                        {children}
                                      </ul>
                                    ),
                                    li: ({ children }) => (
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>{children}</span>
                                      </li>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-semibold text-gray-900">
                                        {children}
                                      </strong>
                                    ),
                                  }}
                                >
                                  {block.markdown}
                                </ReactMarkdown>
                              </div>
                              {/* Render the list block items */}
                              <ul className="list-disc pl-6 space-y-2">
                                {listBlock.items?.map((item, i) => (
                                  <li key={i} className="text-gray-700">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }

                        // Skip rendering the list block if it was just merged
                        if (
                          block.type === "list" &&
                          idx > 0 &&
                          arr[idx - 1]?.type === "markdown"
                        ) {
                          return null;
                        }

                        switch (block.type) {
                          case "video":
                            return (
                              <div
                                key={block.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                              >
                                <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative group">
                                  {block.url ? (
                                    <iframe
                                      src={block.url}
                                      title={block.title || "Video Lesson"}
                                      className="absolute top-0 left-0 w-full h-full"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    // Fallback play button for videos without URLs
                                    <div className="flex items-center justify-center h-full">
                                      <button className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-all duration-300 flex items-center justify-center group-hover:bg-black/40">
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <FiPlay className="w-16 h-16 text-white drop-shadow-lg" />
                                        </motion.div>
                                      </button>
                                      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 mt-4 text-center text-white z-10">
                                        <h3 className="text-2xl font-medium mb-1">
                                          {block.title || currentModule?.title}
                                        </h3>
                                        <p className="text-gray-300 text-lg">
                                          Video Lesson
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );

                          case "text":
                            return (
                              <div
                                key={block.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                              >
                                <div
                                  className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4"
                                  dangerouslySetInnerHTML={{
                                    __html: block.html ?? "",
                                  }}
                                />
                                <textarea
                                  className="w-full border mt-4 border-gray-300 p-3 rounded-md h-40 resize-y"
                                  placeholder="Write your notes here..."
                                  value={userInput[block.id] || ""} 
                                  onChange={(e) =>
                                    handleInputChange(block.id, e)
                                  }
                                />
                              </div>
                            );

                          case "markdown":
                            return (
                              <div
                                key={block.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                              >
                                <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4">
                                  <ReactMarkdown
                                    components={{
                                      h3: ({ children }) => (
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">
                                          {children}
                                        </h3>
                                      ),
                                      p: ({ children }) => (
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                          {children}
                                        </p>
                                      ),
                                      ul: ({ children }) => (
                                        <ul className="space-y-2 mb-4">
                                          {children}
                                        </ul>
                                      ),
                                      li: ({ children }) => (
                                        <li className="flex items-start gap-2">
                                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                          <span>{children}</span>
                                        </li>
                                      ),
                                      strong: ({ children }) => (
                                        <strong className="font-semibold text-gray-900">
                                          {children}
                                        </strong>
                                      ),
                                    }}
                                  >
                                    {block.markdown}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            );

                          case "list":
                            return (
                              <div
                                key={block.id}
                                className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                              >
                                <div className="space-y-3">
                                  {block.items?.map((item, itemIndex) => (
                                    <motion.div
                                      key={itemIndex}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: itemIndex * 0.1 }}
                                      className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                                    >
                                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                        <FiCheck className="w-3.5 h-3.5 text-white" />
                                      </div>
                                      <span className="text-gray-700 leading-relaxed font-medium">
                                        {item}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            );

                          case "quote":
                            return (
                              <motion.div
                                key={block.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-8 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <blockquote className="text-lg font-medium text-gray-800 italic pl-6 relative z-10">
                                  {block.text}
                                </blockquote>
                              </motion.div>
                            );

                          case "quiz":
                            return (
                              <motion.div
                                key={block.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300"
                              >
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <FiCheckCircle className="w-8 h-8 text-white" />
                                  </div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Ready for a Quick Quiz?
                                  </h3>
                                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Test your knowledge with this interactive
                                    quiz and solidify your learning
                                  </p>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab("quiz")}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                                  >
                                    <FiPlay className="w-5 h-5" />
                                    Start Quiz
                                  </motion.button>
                                </div>
                              </motion.div>
                            );

                          default:
                            return null;
                        }
                      })}

                      {/* Learning Outcome Section - keep this if you want it to appear at the end */}
                      {currentModule?.outcome && (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <FiTarget className="w-5 h-5" />
                            Learning Outcome
                          </h4>
                          <p className="text-blue-800">
                            {currentModule.outcome}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          if (activeModule > 0) {
                            setActiveModule(activeModule - 1);
                          }
                        }}
                        disabled={activeModule === 0}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <button
                        onClick={() => {
                          if (activeModule < course.modules.length - 1) {
                            setActiveModule(activeModule + 1);
                          }
                        }}
                        disabled={activeModule === course.modules.length - 1}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Next
                        <FiPlay className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
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
                      What You&apos;ll Get:
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
