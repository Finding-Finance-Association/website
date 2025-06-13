export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  hours?: number;
}


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
  description?: string;
  outcome?: string;
  contentType?: string;
  quizId?: string;
}


export interface DetailedCourse extends Course {
  modules: Module[];
  quizzes: Question[];
}

export const getCourses = (): Course[] => [
  {
    id: "resume-101",
    title: "Resume 101",
    description: "A step-by-step course to help you craft polished, tailored resumes and cover letters that stand out.",
    thumbnail: "/thumbnails/resume_edit.jpeg",
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
    title: "Understanding Credit Scores",
    description: "How credit scores work and how to improve yours.",
    thumbnail: "/thumbnails/credit.jpg",
    category: "Credit",
    hours: 6,
  },
];

const resumeCourseContent = {
  modules: [
    {
      id: "1",
      title: "The Purpose of a Resume",
      contentType: "video",
      outcome: "Goal-setting worksheet",
    },
    {
      id: "2",
      title: "How to Build Your Resume (Step-by-Step)",
      contentType: "Article + Activity",
      outcome: "Build your resume",
    },
    {
      id: "3",
      title: "Advanced Resume Polishing & Tailoring",
      contentType: "Article + video + Template + Quiz",
      outcome: "Tailored resume submission",
      quizId: "3",
    },
    {
      id: "4",
      title: "What Makes a Resume Great?",
      contentType: "Article + Updated Template + video with Case Studies",
      outcome: "Resume teardown + checklist",
    },
    {
      id: "5",
      title: "The Purpose of a Cover Letter",
      contentType: "video",
      outcome: "Goal-setting worksheet",
    },
    {
      id: "6",
      title: "Writing the Perfect Cover Letter",
      contentType: "Article + Template + Writing exercise",
    },
    {
      id: "7",
      title: "Tailoring Your Cover Letter & Common Mistakes",
      contentType: "video + Writing Exercise",
      outcome: "Optional Submission",
    },
  ],
  quizzes: [
    {
      id: "3",
      type: "mcq" as const,
      question: "What’s one way to tailor your resume for a specific job?",
      options: [
        "Send the same resume to all jobs",
        "Match the resume keywords to the job description",
        "Use a fancy template only",
      ],
      correctAnswer: "Match the resume keywords to the job description",
    },
  ],
};

const courseContentMap: Record<string, { modules: Module[]; quizzes: Question[] }> = {
  "resume-101": resumeCourseContent,
  "investing-101": {
    modules: [
      { id: "intro", title: "Introduction to Investing", contentType: "Article" },
      { id: "stocks", title: "Understanding Stocks and Bonds", contentType: "Article" },
      { id: "risks", title: "Managing Investment Risk", contentType: "Article" },
    ],
    quizzes: [
      {
        id: "2",
        type: "mcq",
        question: "Which is a type of investment?",
        options: ["Groceries", "Stocks", "Clothes"],
        correctAnswer: "Stocks",
      },
    ],
  },
  "credit-score": {
    modules: [
      { id: "overview", title: "What is a Credit Score?", contentType: "Article" },
      { id: "factors", title: "Factors Affecting Your Score", contentType: "Article" },
      { id: "improvement", title: "Improving Your Score", contentType: "Article" },
    ],
    quizzes: [
      {
        id: "3",
        type: "text",
        question: "Name one factor that affects credit score.",
        correctAnswer: "Payment history",
      },
    ],
  },
};

export const getCourseById = (id: string): DetailedCourse | undefined => {
  const course = getCourses().find((c) => c.id === id);
  const content = courseContentMap[id];
  if (!course || !content) return undefined;

  return {
    ...course,
    modules: content.modules,
    quizzes: content.quizzes,
  };
};
