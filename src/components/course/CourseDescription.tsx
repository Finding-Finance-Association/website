"use client";
import { useState } from "react";

interface CourseDescriptionProps {
  description: string;
}

export default function CourseDescription({ description }: CourseDescriptionProps) {
  const [showFull, setShowFull] = useState(false);
  const shouldClamp = description.length > 200;

  return (
    <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
      <div className="text-gray-700 leading-relaxed">
        <p className={`${!showFull && shouldClamp ? "line-clamp-3" : ""}`}>
          {description}
        </p>
        {shouldClamp && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-emerald-600 hover:text-emerald-700 font-medium mt-2 transition-colors duration-300"
          >
            {showFull ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </section>
  );
}
