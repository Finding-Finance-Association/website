"use client";

import { FiBookOpen, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/useUser";
import { useUserStore } from "@/stores/userStore";

interface SidebarEnrollCardProps {
  courseId: string;
}

export default function SidebarEnrollCard({ courseId }: SidebarEnrollCardProps) {
  const router = useRouter();
  const {
    uid,
    isLoggedIn,
    isEnrolled,
  } = useUser();
  const addEnrollment = useUserStore((state) => state.addEnrollment);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const alreadyEnrolled = isEnrolled(courseId);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!uid) {
      console.error("User ID is missing.");
      return;
    }

    setIsEnrolling(true);

    try {
      // Update Firestore
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        enrolledCourseIds: arrayUnion(courseId),
      });

      // Update Zustand store immediately for instant UI update
      addEnrollment(courseId);

      // No need for router.refresh() since Zustand will trigger re-renders
    } catch (error) {
      console.error("Error enrolling user:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
      <div className="text-3xl font-bold text-gray-900 mb-4">Free</div>
      <motion.button
        onClick={handleEnroll}
        disabled={isEnrolling || alreadyEnrolled}
        whileHover={{ scale: isEnrolling || alreadyEnrolled ? 1 : 1.02 }}
        whileTap={{ scale: isEnrolling || alreadyEnrolled ? 1 : 0.98 }}
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {alreadyEnrolled ? (
          <>
            <FiCheck className="w-5 h-5" />
            Enrolled
          </>
        ) : isEnrolling ? (
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
