export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  hours?: number;
}

export const getCourses = (): Course[] => [
  {
    id: "finance-basics",
    title: "Finance Basics",
    description: "Learn the fundamentals of personal finance and budgeting.",
    thumbnail: "/thumbnails/personal-finance-basics.jpg",
    category: "General",
    hours: 8,
  },
  {
    id: "investing-101",
    title: "Investing 101",
    description: "Get started with investing and growing your money.",
    thumbnail: "/thumbnails/investing.png",
    category: "Investing",
    hours: 10,
  },
  {
    id: "credit-score",
    title: "Resume",
    description: "How credit scores work and how to improve yours.",
    thumbnail: "/thumbnails/resume_edit.jpeg",
    category: "Credit",
    hours: 6,
  },
];

export interface Question {
  id: string;
  type: "mcq" | "text";
  question: string;
  options?: string[];
  correctAnswer: string;
}


export interface Module {
  id: string;
  title: string;
}

export interface DetailedCourse extends Course {
  modules: Module[];
  quizzes: Question[];
}

export const getCourseById = (id: string): DetailedCourse | undefined => {
  const course = getCourses().find((c) => c.id === id);
  if (!course) return undefined;

  return {
    ...course,
    modules: [
      { id: "section 1", title: "Introduction to the Course" },
      { id: "core", title: "Core Financial Principles" },
      { id: "summary", title: "Course Summary & Next Steps" },
    ],
    quizzes: [
    {
      id: "1",
      type: "mcq",
      question: "Which topic is covered in this course?",
      options: ["Science", "Finance", "History"],
      correctAnswer: "Finance",
    },
    {
      id: "2",
      type: "text",
      question: "Finance basics includes ____.",
      correctAnswer: "Budgeting",
    },
  ],
  };
};