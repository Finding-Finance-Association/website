export function useUser() {
  return {
    userId: "user123",
    enrolledCourseIds: ["finance-basics"], 
    isEnrolled: (courseId: string) => {
      return ["finance-basics"].includes(courseId);
    },
  };
}
