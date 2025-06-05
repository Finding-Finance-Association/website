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
} from "react-icons/fi";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const course = getCourseById(courseId);
  const user = useUser();
  const [enrolled, setEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
    // duration: course.duration || "8 weeks",
    // students: course.students || "1,234",
    // rating: course.rating || 4.8,
    // level: course.level || "Intermediate",
    completionRate: "94%",
    certificate: true,
    hours: course.hours,
  };

  const features = [
    // { icon: FiClock, label: "Duration", value: courseStats.duration },
    // { icon: FiUsers, label: "Students", value: courseStats.students },
    // { icon: FiStar, label: "Rating", value: `${courseStats.rating}/5` },
    // { icon: FiTrendingUp, label: "Level", value: courseStats.level },
    { icon: FiAward, label: "Certificate", value: "Included" },
  ];

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
                    {/* <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {courseStats.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 fill-current" />
                        {courseStats.rating}
                      </span>
                    </div> */}

                    <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                      {course.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-emerald-100">
                      {/* <div className="flex items-center gap-2">
                        <FiUsers className="w-5 h-5" />
                        <span>{courseStats.students} students</span>
                      </div> */}
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
                  <AnimatePresence mode="wait">
                    {enrolled ? (
                      <motion.div
                        key="enrolled"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center mb-6"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          You're Enrolled!
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Continue your learning journey
                        </p>
                        <Link href={`/courses/${courseId}/learn`}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FiPlay className="w-5 h-5" />
                            Continue Learning
                          </motion.button>
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="not-enrolled"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center mb-6"
                      >
                        <div className="mb-6">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {"Free"}
                          </div>
                          {/* <div className="text-sm text-gray-600">One-time payment</div> */}
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
                      </motion.div>
                    )}
                  </AnimatePresence>

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

                  {/* Action Buttons */}
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                        <FiHeart className="w-4 h-4" />
                        Save
                      </button>
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                        <FiShare2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
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
