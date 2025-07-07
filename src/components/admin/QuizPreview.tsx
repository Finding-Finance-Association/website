"use client";

import { useState } from "react";
import QuizComponent from "@/components/QuizComponent";

interface Question {
  id?: string;
  type: "mcq" | "text";
  question: string;
  options?: string[];
  correctAnswer: string;
}

interface QuizPreviewProps {
  questions: Question[];
}

export default function QuizPreview({ questions }: QuizPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (questions.length === 0) {
    return (
      <div style={{
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        textAlign: "center",
        color: "#6c757d"
      }}>
        <p>No quiz questions to preview. Add some questions first!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={() => setShowPreview(!showPreview)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#17a2b8",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          marginBottom: "1rem"
        }}
      >
        {showPreview ? "Hide Quiz Preview" : "Preview Quiz"}
      </button>

      {showPreview && (
        <div style={{
          border: "2px solid #17a2b8",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f8f9fa"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#17a2b8" }}>
            Quiz Preview - How students will see it:
          </h4>
          <QuizComponent
            questions={questions.map((q, index) => ({
              ...q,
              id: q.id || `preview-question-${index}`
            }))}
            isEnrolled={true}
            onSubmit={(results) => {
              alert(`Quiz completed! Score: ${results.score}/${results.totalQuestions}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
