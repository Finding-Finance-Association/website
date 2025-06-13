export function useUser() {
  return {
    userId: "user123",
    enrolledCourseIds: ["resume-101"], 
    isEnrolled: (courseId: string) => {
      return ["resume-101"].includes(courseId);
    },
  };
}
