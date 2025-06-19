// types.ts
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

export const getCourses = (): Course[] => [
  {
    id: "resume-101",
    title: "Resume 101",
    description:
      "A step-by-step course to help you craft polished, tailored resumes and cover letters that stand out.",
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

const resumePolishingQuiz: Question[] = [
  {
    id: "resume-polishing-quiz-q1",
    type: "mcq",
    question:
      "What should each bullet point in the Experiences section focus on?",
    options: [
      "A detailed list of everything you did",
      "Vague tasks to keep things flexible",
      "An action verb, what you did, and why it mattered",
      "Only job titles and employment dates",
    ],
    correctAnswer: "An action verb, what you did, and why it mattered",
  },
  {
    id: "resume-polishing-quiz-q2",
    type: "mcq",
    question:
      "Which of the following is the best example of a strong resume bullet point?",
    options: [
      "Did social media",
      "Helped with events",
      "Ran Instagram",
      "Managed social media campaign that increased engagement by 40%",
    ],
    correctAnswer:
      "Managed social media campaign that increased engagement by 40%",
  },
  {
    id: "resume-polishing-quiz-q3",
    type: "mcq",
    question: "What is the maximum length your professional resume should be?",
    options: [
      "Two pages",
      "One and a half pages",
      "One page",
      "As many pages as needed",
    ],
    correctAnswer: "One page",
  },
  {
    id: "resume-polishing-quiz-q4",
    type: "mcq",
    question:
      "True or False: You should take time to reflect on what you did and why it mattered before adding an experience to your resume.",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    id: "resume-polishing-quiz-q5",
    type: "mcq",
    question:
      "What is the primary reason to avoid repeating similar bullet points in the Experience section?",
    options: [
      "Recruiters don't like long words",
      "Repetitions waste space and weaken the impact",
      "It's required by most resume templates",
      "Employers prefer multiple versions of the same point",
    ],
    correctAnswer: "Repetitions waste space and weaken the impact",
  },
  {
    id: "resume-polishing-quiz-q6",
    type: "mcq",
    question:
      "Which of the following should appear in the Education section of your resume?",
    options: [
      "Your job title and responsibilities",
      "Your school name, degree, GPA, and relevant honors",
      "A list of your favorite professors",
      "A paragraph describing your college experience",
    ],
    correctAnswer: "Your school name, degree, GPA, and relevant honors",
  },
  {
    id: "resume-polishing-quiz-q7",
    type: "mcq",
    question:
      "What type of skills should you list in the Skills section of your resume?",
    options: [
      "Only soft skills like teamwork and communication",
      "Irrelevant but impressive talents",
      "Hard skills like coding languages, Excel, or foreign languages",
      "Skills that you hope to learn in the future",
    ],
    correctAnswer:
      "Hard skills like coding languages, Excel, or foreign languages",
  },
];

export const resumeCourse: DetailedCourse = {
  id: "resume-101",
  title: "Resume 101",
  description: "A step-by-step course to help you craft tailored resumes.",
  thumbnail: "/thumbnails/resume_edit.jpeg",
  category: "General",
  hours: 8,
  modules: [
    {
      id: "1",
      title: "The Purpose of a Resume",
      outcome: "Understand why resumes matter and how to structure them.",
      contentType: "video",
      contentBlocks: [
        {
          id: "1",
          type: "video",
          // url: "https://drive.google.com/file/d/1jerbSvKNLan8m-WrD16j95Hj_8aSufIy/preview",
          url: "https://www.youtube.com/embed/ta99S6Fh53c?si=wTmCZBVj6heUjUYR",
          title: "Why Your Resume Actually Matters",
        },
        {
          id: "2",
          type: "markdown",
          markdown: `
### What is a Resume?

Your resume is a one-page marketing tool. It shows who you are, what you’ve done, and why you deserve a chance.
          `,
        },
        {
          id: "3",
          type: "list",
          items: [
            "It’s not your autobiography.",
            "It’s a tool to get interviews — not the job itself.",
            "It needs to be intentional and specific.",
          ],
        },
        {
          id: "4",
          type: "quote",
          text: `"Your resume says: I take initiative. I learn fast. I care."`,
        },
      ],
    },
    {
      id: "2",
      title: "How to Build Your Resume (Step-by-Step)",
      outcome:
        "Learn to structure your resume from the ground up using real experiences.",
      contentType: "Article + Activity",
      contentBlocks: [
        {
          id: "1",
          type: "markdown",
          markdown: `
### How to Build a Resume from Scratch

A resume is a story. Every experience and activity you put on your resume conveys who you are, what you’ve done, and what you’re most passionate about.

In this section, we’ll show you how to effectively communicate your experiences to future employers.
      `,
        },
        {
          id: "2",
          type: "markdown",
          markdown: `
### Progressive Notetaking

One of the best resume-writing habits is to track key events and outcomes as they happen.

Keep a running list of:
- What you contributed to
- Results you helped achieve
- Skills and lessons learned

If you haven’t tracked this yet, no worries — the next step is **brainstorming**.
      `,
        },
        {
          id: "3",
          type: "markdown",
          markdown: `
### Brainstorming

Brainstorming is essential, even if you’ve already written resumes before. Spend 5–10 minutes per experience and write down everything you remember about it.

**Helpful prompts:**
- What did you do every day?
- Who did you interact with?
- What results did you help achieve?
- What skills/tools did you use?
- What materials can you refer to (emails, slides, docs)?
- Did you receive any awards or recognition?
      `,
        },
        {
          id: "4",
          type: "list",
          items: [
            "Education",
            "Experiences",
            "Leadership",
            "Community Service",
            "Skills",
            "Interests",
            "Activities",
            "Awards and Honors",
            "Relevant Coursework",
          ],
        },
        {
          id: "5",
          type: "markdown",
          markdown: `
### Activity: Brainstorming Through an Experience

Think about one experience you want to include on your resume. 

🧠 Use the tools above to guide you.

⏱ Set a timer for **10 minutes** and write bullet points about:
- What you did
- What tools you used
- Who you worked with
- What results or value you added
      `,
        },
        {
          id: "6",
          type: "text",
          html: `
<h3 class="text-xl font-semibold mb-2">📝 Your Turn</h3>
<p class="mb-2">Use the space below to record your brainstorm notes. This text will be referenced in the next module when you start drafting.</p>
<textarea class="w-full border border-gray-300 p-3 rounded-md h-40 resize-y" placeholder="Write your experience notes here..."></textarea>
      `,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Resume Polishing & Tailoring",
      contentType: "Article + Video + Template + Quiz",
      outcome: "Tailored resume submission",
      contentBlocks: [
        {
          id: "1",
          type: "video",
          url: "https://drive.google.com/file/d/1s_52DahKNnSW7iVAqpiEzqDOCQTwXG1Y/preview",
          title: "The Structure of a Resume",
        },
        {
          id: "2",
          type: "markdown",
          markdown: `### Resume Length and Overview

Your resume should be **one page MAXIMUM**. Many companies use AI to screen resumes and long ones get discarded. This section provides you with structure and tools to make yours clear, polished, and impactful.`,
        },
        {
          id: "3",
          type: "list",
          items: [
            "Heading: Large bold name, then contact info (email, phone, LinkedIn)",
            "Education: School name (bold), degree (italic), GPA, honors, organizations",
            "Experience: Jobs/internships, with bullet points on what you did and why it mattered",
            "Leadership & Involvement: Community or extracurricular roles with dates and roles",
            "Skills: Hard skills like Excel, PowerPoint, languages",
            "Interests: Personal hobbies to show individuality",
          ],
        },
        {
          id: "4",
          type: "markdown",
          markdown: `### Activity: Fill Out the Resume Template

Use the template below and your brainstorm from Section 2. Don’t worry about filtering yet — just start adding everything in. We’ll polish it in the next part.`,
        },
        {
          id: "5",
          type: "text",
          html: `<h3>Paste your brainstorm here:</h3><textarea class='w-full border border-gray-300 p-3 rounded-md h-40 resize-y' placeholder='Paste or summarize your brainstorm here...'></textarea>`,
        },
        {
          id: "6",
          type: "markdown",
          markdown: `### From Brainstorm to Resume: How to Build Great Bullet Points

### Step 1: Pick What Matters
Focus on the strongest, most relevant items that show skills, results, or initiative.

### Step 2: Remove Repetition
Merge similar points and tighten language.

**Bad examples**:
- Coordinated logistics for event
- Organized event operations

**Better**:
- Coordinated logistics and operations for 200+ person gala, raising $5,000

### Step 3: Action + Impact Formula
- **Structure**: Action Verb + What You Did + Why It Mattered
- **Example**: Developed onboarding materials for 10+ interns, reducing ramp-up time by 30%

> You’re not just listing tasks — you’re showing value.`,
        },
        {
          id: "7",
          type: "quote",
          text: "“Now you’re not just listing tasks — you’re showing value.”",
        },
        {
          id: "8",
          type: "markdown",
          markdown: `Once you’ve converted your brainstorm into bullet points, you’re ready to tailor your resume to specific roles. We’ll practice that in the next step.`,
        },
        {
          id: "9",
          type: "quiz",
          quizId: "resume-polishing-quiz",
        },
      ],
    },
  ],
  quizzes: [...resumePolishingQuiz],
};

const courseContentMap: Record<
  string,
  { modules: Module[]; quizzes: Question[] }
> = {
  "resume-101": resumeCourse,
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
