"use client";
import { FiBookOpen, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { motion } from "framer-motion";

interface SidebarEnrollCardProps {
  courseId: string;
}

export default function SidebarEnrollCard({ courseId }: SidebarEnrollCardProps) {
  const user = useUser();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!user.userId) {
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay

    user.enrolledCourseIds.push(courseId);
    setIsEnrolling(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
      <div className="text-3xl font-bold text-gray-900 mb-4">Free</div>
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
  );
}
