"use client";
import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "@/lib/mockData";
import { useUser } from "@/lib/useUser";
import ModuleList from "@/components/ModuleList";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { FiChevronLeft, FiMenu, FiX } from "react-icons/fi";
import CourseHeader from "@/components/course/CourseHeader";
import CourseDescription from "@/components/course/CourseDescription";
import SidebarEnrollCard from "@/components/course/SidebarEnrollCard";
import SidebarHighlights from "@/components/course/SidebarHighlights";
import ModuleNavigator from "@/components/course/ModuleNavigator";
import ModuleContent from "@/components/course/ModuleContent";
import CourseNotFound from "@/components/course/CourseNotFound";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  hours?: number;
}

export interface ContentBlock {
  id: string;
  type: "text" | "markdown" | "video" | "list" | "quiz" | "quote";
  html?: string;
  markdown?: string;
  url?: string;
  title?: string;
  src?: string;
  alt?: string;
  items?: string[];
  quizId?: string;
  text?: string;
}

export interface Module {
  id: string;
  title: string;
  outcome?: string;
  contentType?: string;
  contentBlocks: ContentBlock[];
}

export interface Question {
  id: string;
  type: "mcq" | "text";
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface DetailedCourse extends Course {
  modules: Module[];
  quizzes: Question[];
}

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<DetailedCourse | null>(null);
  const user = useUser();
  const [enrolled, setEnrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeTab, setActiveTab] = useState<"lesson" | "quiz">("lesson");
  const [completedModules, setCompletedModules] = useState(new Set<number>());
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userInput, setUserInput] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.err || "Server Error");
        }

        const data = await res.json();
        setCourse(data);
        setLength(data.modules.length || 0);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [courseId]);

  // Function to handle the textarea input change (need to work on this)
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
  }, [courseId]);

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-dashed rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return <CourseNotFound />;
  }

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

  const progressPercentage = Math.round((completedModules.size / length) * 100);

  // If enrolled, show learning interface
  if (enrolled) {
    const currentModule = course.modules[activeModule];
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
                  Module {activeModule + 1} of {length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                Exit
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Course Navigation */}
            <ModuleNavigator
              modules={course.modules}
              activeModule={activeModule}
              completedModules={completedModules}
              activeTab={activeTab}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onSelectModule={(i) => {
                setActiveModule(i);
              }}
              onSetTab={setActiveTab}
              onToggleComplete={toggleModuleCompletion}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                <ModuleContent
                  currentModule={currentModule}
                  activeModule={activeModule}
                  courseLength={length}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setActiveModule={setActiveModule}
                  toggleModuleCompletion={toggleModuleCompletion}
                  quizData={course.quizzes}
                  isEnrolled={enrolled}
                />
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
                <CourseHeader title={course.title} />

                {/* Course Description */}
                <CourseDescription description={course.description} />

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
                {/* Enrollment Status */}
                <SidebarEnrollCard courseId={courseId} />

                {/* Course Highlights */}
                <SidebarHighlights />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
