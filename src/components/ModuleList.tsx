// src/components/ModuleList.tsx

"use client";
import Link from "next/link";
import { Module } from "@/lib/mockData";

interface Props {
  courseId: string;
  modules: Module[];
  isEnrolled: boolean;
}

export default function ModuleList({ courseId, modules, isEnrolled }: Props) {
  return (
    <ul className="space-y-4 animate-fade-in">
      {modules.map((mod, index) => {
        const locked = !isEnrolled;
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
              {index + 1}. {mod.title}
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
