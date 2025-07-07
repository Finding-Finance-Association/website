import { create } from "zustand";

interface UserStore {
  uid: string | null;
  email: string | null;
  username: string | null;
  enrolledCourseIds: string[];
  setUser: (user: {
    uid: string;
    email: string;
    username: string;
    enrolledCourseIds: string[];
  }) => void;
  addEnrollment: (courseId: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  uid: null,
  email: null,
  username: null,
  enrolledCourseIds: [],
  setUser: (user) =>
    set(() => ({
      uid: user.uid,
      email: user.email,
      username: user.username,
      enrolledCourseIds: user.enrolledCourseIds || [],
    })),
  addEnrollment: (courseId) =>
    set((state) => ({
      enrolledCourseIds: [...new Set([...state.enrolledCourseIds, courseId])],
    })),
  clearUser: () =>
    set({
      uid: null,
      email: null,
      username: null,
      enrolledCourseIds: [],
    }),
}));
