
"use client";
import Link from "next/link";

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
  order?: number;
}

export interface Module {
  id: string;
  title: string;
  outcome?: string;
  contentType?: string;
  contentBlocks: ContentBlock[];
  order?: number;
}

interface Props {
  courseId: string;
  modules: Module[];
  isEnrolled: boolean;
}

export default function ModuleList({ courseId, modules, isEnrolled }: Props) {
  // Sort modules by order before rendering
  const sortedModules = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ul className="space-y-4 animate-fade-in">
      {sortedModules.map((mod, index) => {
        const locked = !isEnrolled;
        const displayOrder = mod.order || index + 1;
        return (
          <li
            key={mod.id}
            className={`p-4 border rounded-md flex justify-between items-center ${
              locked
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 transition"
            }`}
          >
            <span>
              {displayOrder}. {mod.title}
            </span>
            {!locked && (
              <Link href={`/courses/${courseId}/learn?module=${mod.id}`}>
                <button className="text-sm text-indigo-600 hover:underline">
                  Start
                </button>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
