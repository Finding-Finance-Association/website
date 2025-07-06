// src/lib/useUser.ts

import { useUserStore } from "@/stores/userStore";

export function useUser() {
  const uid = useUserStore((state) => state.uid);
  const email = useUserStore((state) => state.email);
  const username = useUserStore((state) => state.username);
  const enrolledCourseIds = useUserStore((state) => state.enrolledCourseIds);

  const isLoggedIn = !!uid;

  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds?.includes(courseId);
  };

  return {
    uid,
    email,
    username,
    enrolledCourseIds,
    isLoggedIn,
    isEnrolled,
  };
}
